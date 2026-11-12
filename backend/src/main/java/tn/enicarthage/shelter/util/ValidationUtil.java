package tn.enicarthage.shelter.util;

import java.math.BigDecimal;

public final class ValidationUtil {

    private ValidationUtil() {
    }

    public static void requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }

    public static void requirePositive(int value, String message) {
        if (value <= 0) {
            throw new IllegalArgumentException(message);
        }
    }

    public static void requirePositive(BigDecimal value, String message) {
        if (value == null || value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(message);
        }
    }

    public static void requireMaxScale(BigDecimal value, int maxScale, String message) {
        if (value != null && value.stripTrailingZeros().scale() > maxScale) {
            throw new IllegalArgumentException(message);
        }
    }

    public static void requireAtMost(BigDecimal value, BigDecimal maximum, String message) {
        if (value != null && value.compareTo(maximum) > 0) {
            throw new IllegalArgumentException(message);
        }
    }

    public static void requireNonNegative(int value, String message) {
        if (value < 0) {
            throw new IllegalArgumentException(message);
        }
    }

    public static void requireNotNull(Object value, String message) {
        if (value == null) {
            throw new IllegalArgumentException(message);
        }
    }
}
