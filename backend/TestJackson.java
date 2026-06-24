import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TestJackson {
    @Data
    public static class MyProduct {
        @JsonProperty("isFeatured")
        private Boolean isFeatured = false;
    }

    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        
        String json = "{\"isFeatured\": true}";
        MyProduct p = mapper.readValue(json, MyProduct.class);
        System.out.println("Deserialized isFeatured: " + p.getIsFeatured());
        
        System.out.println("Serialized: " + mapper.writeValueAsString(p));
    }
}
