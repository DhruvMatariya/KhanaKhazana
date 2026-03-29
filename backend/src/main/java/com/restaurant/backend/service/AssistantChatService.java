package com.restaurant.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.backend.model.MenuItem;
import com.restaurant.backend.model.CustomerNeed;
import com.restaurant.backend.model.Order;
import com.restaurant.backend.model.Restaurant;
import com.restaurant.backend.model.User;
import com.restaurant.backend.model.OrderItem;
import com.restaurant.backend.repository.CustomerNeedRepository;
import com.restaurant.backend.repository.MenuItemRepository;
import com.restaurant.backend.repository.OrderRepository;
import com.restaurant.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AssistantChatService {

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");
    private static final Pattern HASH_ORDER_REFERENCE_PATTERN = Pattern.compile("#([A-Za-z0-9]{6,24})\\b");
    private static final Pattern ORDER_WORD_REFERENCE_PATTERN = Pattern.compile("\\border\\s*#?([A-Za-z0-9]{6,24})\\b", Pattern.CASE_INSENSITIVE);

    private record RestaurantScore(String name, double avg, long ratedCount) {}

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final CustomerNeedRepository customerNeedRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${groq.api.key:}")
    private String groqApiKey;

    @Value("${groq.api.model:llama-3.3-70b-versatile}")
    private String groqApiModel;

    public AssistantChatService(
            OrderRepository orderRepository,
            RestaurantRepository restaurantRepository,
            MenuItemRepository menuItemRepository,
            CustomerNeedRepository customerNeedRepository,
            ObjectMapper objectMapper
    ) {
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.customerNeedRepository = customerNeedRepository;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    public String generateCustomerReply(User user, String message, String restaurantId) {
        if (message == null || message.isBlank()) {
            return "Please type a question so I can help you.";
        }

        List<Order> customerOrders = orderRepository.findByUserId(user.getId());
        String ticketReply = tryCreateCustomerNeedTicket(user, message, customerOrders);
        if (ticketReply != null) {
            return ticketReply;
        }

        String directOrderReply = tryDirectOrderLookupReply(message, customerOrders);
        if (directOrderReply != null) {
            return directOrderReply;
        }

        String context = buildCustomerContext(user, restaurantId);

        if (groqApiKey == null || groqApiKey.isBlank()) {
            return "Chat assistant is not configured yet. Please set GROQ_API_KEY in backend environment.";
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", groqApiModel);
            payload.put("temperature", 0.3);
            payload.put("max_tokens", 500);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of(
                    "role", "system",
                    "content", "You are a restaurant support assistant. Use only the provided context. " +
                            "If context is insufficient, clearly say what is missing. Keep answers short and practical."
            ));
            messages.add(Map.of(
                    "role", "user",
                    "content", "Context:\n" + context + "\n\nCustomer question: " + message
            ));
            payload.put("messages", messages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(GROQ_URL, requestEntity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode content = root.path("choices").path(0).path("message").path("content");
            if (content.isTextual() && !content.asText().isBlank()) {
                return content.asText().trim();
            }

            return "I could not generate an answer right now. Please try again.";
        } catch (Exception ex) {
            return "I could not reach the assistant service right now. Please try again shortly.";
        }
    }

    private String buildCustomerContext(User user, String restaurantId) {
        List<Restaurant> allRestaurants = restaurantRepository.findAll();
        Map<String, Restaurant> restaurantById = allRestaurants.stream()
                .collect(Collectors.toMap(Restaurant::getId, r -> r, (a, b) -> a));

        List<Order> customerOrders = orderRepository.findByUserId(user.getId()).stream()
                .sorted(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();

        List<Order> scopedOrders = customerOrders.stream()
            .filter(order -> restaurantId != null && !restaurantId.isBlank() && Objects.equals(order.getRestaurantId(), restaurantId))
            .toList();

        StringBuilder sb = new StringBuilder();
        sb.append("Customer: ").append(user.getUsername()).append("\n");
        sb.append("Total customer orders (all restaurants): ").append(customerOrders.size()).append("\n");
        if (restaurantId != null && !restaurantId.isBlank()) {
            sb.append("Orders in selected restaurant scope: ").append(scopedOrders.size()).append("\n");
        }

        sb.append("Recent customer orders across all restaurants:\n");
        customerOrders.stream().limit(6).forEach(order -> {
            String restaurantName = restaurantById.containsKey(order.getRestaurantId())
                    ? restaurantById.get(order.getRestaurantId()).getName()
                    : "Unknown Restaurant";
            String created = formatDate(order.getCreatedAt());
            sb.append("- #")
                    .append(shortId(order.getId()))
                    .append(" | ")
                    .append(restaurantName)
                    .append(" | status: ")
                    .append(normalize(order.getDeliveryStatus(), order.getStatus()))
                    .append(" | total: INR ")
                    .append(String.format(Locale.ROOT, "%.2f", order.getTotalAmount()))
                    .append(" | at ")
                    .append(created)
                    .append("\n");
        });

        if (customerOrders.isEmpty()) {
            sb.append("- No orders found for this logged-in customer.\n");
        }

        sb.append("Top restaurants by menu rating:\n");
        List<String> restaurantScoreRows = allRestaurants.stream()
                .map(restaurant -> {
                    List<MenuItem> menu = menuItemRepository.findByRestaurantIdAndAvailableTrueOrderByCategoryAscNameAsc(restaurant.getId());
                    double avg = menu.stream().mapToDouble(MenuItem::getAverageRating).average().orElse(0.0);
                    long ratedCount = menu.stream().filter(item -> item.getReviewCount() > 0).count();
                return new RestaurantScore(
                    restaurant.getName() == null ? "Unknown" : restaurant.getName(),
                    avg,
                    ratedCount
                );
                })
            .sorted((a, b) -> Double.compare(b.avg(), a.avg()))
                .limit(5)
            .map(row -> "- " + row.name() + " | avg menu rating: " + String.format(Locale.ROOT, "%.1f", row.avg()) +
                " | rated dishes: " + row.ratedCount())
                .toList();

        if (restaurantScoreRows.isEmpty()) {
            sb.append("- No restaurant rating data available yet.\n");
        } else {
            restaurantScoreRows.forEach(line -> sb.append(line).append("\n"));
        }

        List<MenuItem> scopedMenuItems = new ArrayList<>();
        if (restaurantId != null && !restaurantId.isBlank()) {
            scopedMenuItems.addAll(menuItemRepository.findByRestaurantIdAndAvailableTrueOrderByCategoryAscNameAsc(restaurantId));
        } else {
            allRestaurants.forEach(restaurant ->
                    scopedMenuItems.addAll(menuItemRepository.findByRestaurantIdAndAvailableTrueOrderByCategoryAscNameAsc(restaurant.getId()))
            );
        }

        sb.append("Top rated dishes:\n");
        List<MenuItem> topItems = scopedMenuItems.stream()
                .filter(item -> item.getReviewCount() > 0)
                .sorted(Comparator
                        .comparing(MenuItem::getAverageRating, Comparator.reverseOrder())
                        .thenComparing(MenuItem::getReviewCount, Comparator.reverseOrder()))
                .limit(8)
                .toList();

        if (topItems.isEmpty()) {
            sb.append("- No dish ratings yet.\n");
        } else {
            topItems.forEach(item -> {
                String restaurantName = restaurantById.containsKey(item.getRestaurantId())
                        ? restaurantById.get(item.getRestaurantId()).getName()
                        : "Unknown Restaurant";
                sb.append("- ")
                        .append(item.getName())
                        .append(" (")
                        .append(restaurantName)
                        .append(") | rating ")
                        .append(String.format(Locale.ROOT, "%.1f", item.getAverageRating()))
                        .append(" | reviews ")
                        .append(item.getReviewCount())
                        .append("\n");
            });
        }

        sb.append("Rule: Do not reveal private details of other customers.");
        return sb.toString();
    }

    private String shortId(String id) {
        if (id == null || id.isBlank()) {
            return "UNKNOWN";
        }
        return id.length() > 6 ? id.substring(id.length() - 6).toUpperCase(Locale.ROOT) : id.toUpperCase(Locale.ROOT);
    }

    private String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "unknown time";
        }
        return DATE_FORMAT.format(dateTime);
    }

    private String normalize(String deliveryStatus, String status) {
        String value = (deliveryStatus != null && !deliveryStatus.isBlank()) ? deliveryStatus : status;
        if (value == null || value.isBlank()) {
            return "UNKNOWN";
        }
        return value.toUpperCase(Locale.ROOT);
    }

    private String tryDirectOrderLookupReply(String message, List<Order> customerOrders) {
        if (isRecentOrdersIntent(message)) {
            return buildRecentOrdersReply(customerOrders);
        }

        String reference = extractOrderReference(message);
        if (reference == null) {
            return null;
        }

        Optional<Order> matched = customerOrders.stream()
                .filter(order -> {
                    String fullId = order.getId() == null ? "" : order.getId().toUpperCase(Locale.ROOT);
                    String shortOrderId = shortId(order.getId());
                    return fullId.equals(reference) || shortOrderId.equals(reference);
                })
                .findFirst();

        if (matched.isPresent()) {
            Order order = matched.get();
            return "I found order #" + shortId(order.getId()) +
                    ". Current status is " + normalize(order.getDeliveryStatus(), order.getStatus()) +
                    ". Please share your complaint details and I will help you draft it for support.";
        }

        if (customerOrders.isEmpty()) {
            return "I do not see any orders for your account right now. Please verify you are logged in with the same customer account that placed the order.";
        }

        String recentIds = customerOrders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .map(order -> "#" + shortId(order.getId()))
                .collect(Collectors.joining(", "));

        return "I could not find order #" + reference +
                " under your account. Your recent order IDs are: " + recentIds + ".";
    }

    private boolean isRecentOrdersIntent(String message) {
        if (message == null || message.isBlank()) {
            return false;
        }

        String lower = message.toLowerCase(Locale.ROOT);
        return lower.contains("recent order")
                || lower.contains("my orders")
                || lower.contains("order history")
                || lower.contains("latest order")
                || lower.contains("last order")
                || lower.contains("recent purchases");
    }

    private String buildRecentOrdersReply(List<Order> customerOrders) {
        if (customerOrders == null || customerOrders.isEmpty()) {
            return "I do not see any orders for your account yet.";
        }

        List<Order> recentOrders = customerOrders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .toList();

        StringBuilder sb = new StringBuilder("Here are your recent orders:\n");
        for (Order order : recentOrders) {
            sb.append("- #")
                    .append(shortId(order.getId()))
                    .append(" | status: ")
                    .append(normalize(order.getDeliveryStatus(), order.getStatus()))
                    .append(" | total: INR ")
                    .append(String.format(Locale.ROOT, "%.2f", order.getTotalAmount()))
                    .append(" | placed: ")
                    .append(formatDate(order.getCreatedAt()))
                    .append("\n");
        }

        return sb.toString().trim();
    }

    private String tryCreateCustomerNeedTicket(User user, String message, List<Order> customerOrders) {
        String lower = message.toLowerCase(Locale.ROOT);
        boolean complaintIntent = lower.contains("complain") || lower.contains("complaint") || lower.contains("issue") || lower.contains("soggy") || lower.contains("file complaint") || lower.contains("bad");
        boolean suggestionIntent = lower.contains("suggest") || lower.contains("suggestion") || lower.contains("improve");
        if (!complaintIntent && !suggestionIntent) {
            return null;
        }

        String reference = extractOrderReference(message);
        if (reference == null) {
            return "Please mention the order number (example: #419EC5) in the same message so I can file this for the correct restaurant.";
        }

        Optional<Order> matched = customerOrders.stream()
                .filter(order -> {
                    String fullId = order.getId() == null ? "" : order.getId().toUpperCase(Locale.ROOT);
                    String shortOrderId = shortId(order.getId());
                    return fullId.equals(reference) || shortOrderId.equals(reference);
                })
                .findFirst();

        if (matched.isEmpty()) {
            return "I could not find order #" + reference + " in your account, so I could not file the complaint yet.";
        }

        Order order = matched.get();
        String dishName = inferDishName(message, order.getItems());
        String type = complaintIntent ? "COMPLAINT" : "SUGGESTION";

        CustomerNeed need = new CustomerNeed();
        need.setRestaurantId(order.getRestaurantId());
        need.setOrderId(order.getId());
        need.setShortOrderId(shortId(order.getId()));
        need.setUserId(user.getId());
        need.setUsername(user.getUsername());
        need.setDishName(dishName);
        need.setMessage(message.trim());
        need.setType(type);
        need.setStatus("OPEN");
        need.setCreatedAt(LocalDateTime.now());
        customerNeedRepository.save(need);

        return "Your " + type.toLowerCase(Locale.ROOT) + " for order #" + shortId(order.getId()) +
                " has been submitted to the restaurant" + (dishName != null ? " (dish: " + dishName + ")" : "") + ".";
    }

    private String inferDishName(String message, List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            return null;
        }

        String lowerMessage = message == null ? "" : message.toLowerCase(Locale.ROOT);
        for (OrderItem item : items) {
            if (item == null || item.getItemName() == null) {
                continue;
            }
            String itemLower = item.getItemName().toLowerCase(Locale.ROOT);
            if (!itemLower.isBlank() && lowerMessage.contains(itemLower)) {
                return item.getItemName();
            }
        }

        if (items.size() == 1 && items.get(0) != null) {
            return items.get(0).getItemName();
        }

        return null;
    }

    private String extractOrderReference(String message) {
        if (message == null || message.isBlank()) {
            return null;
        }

        Matcher hashMatcher = HASH_ORDER_REFERENCE_PATTERN.matcher(message);
        if (hashMatcher.find()) {
            return hashMatcher.group(1).toUpperCase(Locale.ROOT);
        }

        Matcher orderWordMatcher = ORDER_WORD_REFERENCE_PATTERN.matcher(message);
        if (orderWordMatcher.find()) {
            return orderWordMatcher.group(1).toUpperCase(Locale.ROOT);
        }

        return null;
    }
}
