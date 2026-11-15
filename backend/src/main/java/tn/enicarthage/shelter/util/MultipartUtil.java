package tn.enicarthage.shelter.util;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

public final class MultipartUtil {

    private MultipartUtil() {
    }

    public static byte[] extraireFichier(byte[] body, String contentType) {
        if (body == null || body.length == 0) {
            return new byte[0];
        }

        if (contentType == null || !contentType.toLowerCase().contains("multipart/")) {
            return body;
        }

        String boundary = extraireBoundary(contentType);
        if (boundary == null || boundary.isBlank()) {
            return body;
        }

        byte[] boundaryBytes = ("--" + boundary).getBytes(StandardCharsets.ISO_8859_1);
        int premierBoundary = trouverSequence(body, boundaryBytes, 0);
        if (premierBoundary == -1) {
            return body;
        }

        int headersEnd = -1;
        int sepLength = 4;
        byte[] rn = new byte[]{13, 10, 13, 10};
        byte[] nn = new byte[]{10, 10};

        int rIndex = trouverSequence(body, rn, premierBoundary + boundaryBytes.length);
        int nIndex = trouverSequence(body, nn, premierBoundary + boundaryBytes.length);

        if (rIndex != -1 && (nIndex == -1 || rIndex <= nIndex)) {
            headersEnd = rIndex;
            sepLength = 4;
        } else if (nIndex != -1) {
            headersEnd = nIndex;
            sepLength = 2;
        }

        if (headersEnd == -1) {
            return body;
        }

        int payloadStart = headersEnd + sepLength;
        byte[] finBoundary = ("\r\n--" + boundary).getBytes(StandardCharsets.ISO_8859_1);
        int payloadEnd = trouverSequence(body, finBoundary, payloadStart);

        if (payloadEnd == -1) {
            byte[] finBoundarySimple = ("\n--" + boundary).getBytes(StandardCharsets.ISO_8859_1);
            payloadEnd = trouverSequence(body, finBoundarySimple, payloadStart);
        }

        if (payloadEnd == -1) {
            payloadEnd = trouverSequence(body, boundaryBytes, payloadStart);
        }

        if (payloadEnd == -1 || payloadEnd < payloadStart) {
            return Arrays.copyOfRange(body, payloadStart, body.length);
        }

        return Arrays.copyOfRange(body, payloadStart, payloadEnd);
    }

    private static String extraireBoundary(String contentType) {
        String marqueur = "boundary=";
        int index = contentType.indexOf(marqueur);
        if (index == -1) {
            return null;
        }
        String valeur = contentType.substring(index + marqueur.length()).trim();
        if (valeur.startsWith("\"")) {
            int fin = valeur.indexOf('"', 1);
            if (fin != -1) {
                return valeur.substring(1, fin);
            }
        }
        int pointVirgule = valeur.indexOf(';');
        if (pointVirgule != -1) {
            valeur = valeur.substring(0, pointVirgule);
        }
        int espace = valeur.indexOf(' ');
        if (espace != -1) {
            valeur = valeur.substring(0, espace);
        }
        return valeur.trim();
    }

    private static int trouverSequence(byte[] source, byte[] cible, int debut) {
        if (source == null || cible == null || debut < 0 || cible.length == 0) {
            return -1;
        }
        for (int i = debut; i <= source.length - cible.length; i++) {
            boolean match = true;
            for (int j = 0; j < cible.length; j++) {
                if (source[i + j] != cible[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return i;
            }
        }
        return -1;
    }
}
