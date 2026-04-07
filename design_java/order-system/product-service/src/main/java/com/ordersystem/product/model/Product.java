package com.ordersystem.product.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product implements Serializable {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private int stock;

    @Version
    private Long version;

    public Product() {}

    public Product(String id, String name, BigDecimal price, int stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    public boolean reserveStock(int quantity) {
        if (this.stock < quantity) return false;
        this.stock -= quantity;
        return true;
    }

    public void releaseStock(int quantity) {
        this.stock += quantity;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public int getStock() { return stock; }
    public Long getVersion() { return version; }
}
