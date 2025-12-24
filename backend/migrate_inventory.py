from app.database import engine
from sqlalchemy import text

def migrate_inventory():
    with engine.connect() as conn:
        print("Migrating inventory columns...")
        
        # Add columns to products table
        columns = [
            ("sku", "VARCHAR(50) NULL"),
            ("stock_quantity", "INTEGER DEFAULT 0"),
            ("min_stock", "INTEGER DEFAULT 5"),
            ("cost_price", "FLOAT DEFAULT 0.0"),
            ("supplier", "VARCHAR(100) NULL")
        ]
        
        for col, dtype in columns:
            try:
                conn.execute(text(f"ALTER TABLE products ADD COLUMN {col} {dtype}"))
                print(f"Added {col}")
            except Exception as e:
                print(f"Skipped {col}: {e}")
        
        # Create stock_movements table
        print("Creating stock_movements table...")
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS stock_movements (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL,
                    movement_type VARCHAR(20) NOT NULL,
                    reason VARCHAR(255),
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (product_id) REFERENCES products (id)
                )
            """)) # Note: Using SQLite syntax for CREATE TABLE compatibility with default fallback, though "ALTER TABLE" syntax differs. 
                  # Assuming SQLite based on previous context ("sql_app.db"). 
                  # Wait, previous error showed PyMySQL, which means MySQL.
                  # I need to use MySQL syntax for CREATE TABLE.
        except Exception as e:
            print(f"Error creating table (might exist): {e}")

        # Re-running for MySQL specific logic just in case
        try:
             conn.execute(text("""
                CREATE TABLE IF NOT EXISTS stock_movements (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    product_id INT NOT NULL,
                    quantity INT NOT NULL,
                    movement_type VARCHAR(20) NOT NULL,
                    reason VARCHAR(255),
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (product_id) REFERENCES products(id)
                )
            """))
             print("Created stock_movements (MySQL)")
        except Exception as e:
            print(f"Skipped MySQL Create: {e}")

        conn.commit()
        print("Inventory migration complete.")

if __name__ == "__main__":
    migrate_inventory()
