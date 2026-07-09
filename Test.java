import com.fasterxml.jackson.databind.ObjectMapper;

public class Test {
    public static void main(String[] args) throws Exception {
        String json = "{\"id\":1,\"taxRate\":5.0,\"deliveryFee\":40.0,\"packingCharge\":15.0,\"prepTime\":15,\"storeActive\":false}";
        ObjectMapper mapper = new ObjectMapper();
        com.popobob.model.StoreSettings settings = mapper.readValue(json, com.popobob.model.StoreSettings.class);
        System.out.println("Result: " + settings.getStoreActive());
    }
}
