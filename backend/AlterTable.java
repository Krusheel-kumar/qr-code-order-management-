import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class AlterTable {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://ep-patient-cloud-aiznb5ds.c-4.us-east-1.aws.neon.tech:5432/neondb?sslmode=require";
        String user = "neondb_owner";
        String password = "npg_PS1Crclw7Xpy";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate("ALTER TABLE products ALTER COLUMN image_url TYPE TEXT");
            System.out.println("Table altered successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
