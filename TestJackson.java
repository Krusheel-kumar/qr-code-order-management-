public class TestJackson {
    public static void main(String[] args) throws Exception {
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        String[] payloads = {
            "{\\\"id\\\":1}",
            "{\"\\\"id\\\"\":1}",
            "{\n\\\"id\\\":1}",
            "{\\\\id:1}"
        };
        for (String p : payloads) {
            System.out.println("Payload: " + p);
            try {
                mapper.readTree(p);
                System.out.println("Success!");
            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}
