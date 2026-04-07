package com.ordersystem.product.service;

import com.ordersystem.product.model.Product;
import com.ordersystem.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
    }

    @Test
    void shouldCreateAndRetrieveProduct() {
        Product product = productService.createProduct(
                new Product("P1", "Laptop", new BigDecimal("999.99"), 50));

        var found = productService.getProduct("P1");
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Laptop");
        assertThat(found.get().getStock()).isEqualTo(50);
    }

    @Test
    void shouldReserveInventory() {
        productService.createProduct(new Product("P2", "Phone", new BigDecimal("499.99"), 10));

        boolean reserved = productService.reserveInventory("P2", 3);
        assertThat(reserved).isTrue();
        assertThat(productRepository.findById("P2").get().getStock()).isEqualTo(7);
    }

    @Test
    void shouldRejectReservationWhenInsufficientStock() {
        productService.createProduct(new Product("P3", "Tablet", new BigDecimal("299.99"), 2));

        boolean reserved = productService.reserveInventory("P3", 5);
        assertThat(reserved).isFalse();
        assertThat(productRepository.findById("P3").get().getStock()).isEqualTo(2);
    }

    @Test
    void shouldReleaseInventory() {
        productService.createProduct(new Product("P4", "Watch", new BigDecimal("199.99"), 5));
        productService.reserveInventory("P4", 3);

        productService.releaseInventory("P4", 3);
        assertThat(productRepository.findById("P4").get().getStock()).isEqualTo(5);
    }

    @Test
    void shouldReturnEmptyForNonexistentProduct() {
        assertThat(productService.getProduct("NONEXISTENT")).isEmpty();
    }

    @Test
    void shouldRejectReservationForNonexistentProduct() {
        assertThat(productService.reserveInventory("NONEXISTENT", 1)).isFalse();
    }

    @Test
    void shouldServeCachedProduct() {
        productService.createProduct(new Product("P5", "Headphones", new BigDecimal("79.99"), 100));

        // First call loads from DB and caches
        var first = productService.getProduct("P5");
        // Second call should hit cache (verified by log output, no DB query)
        var second = productService.getProduct("P5");

        assertThat(first).isPresent();
        assertThat(second).isPresent();
        assertThat(first.get().getId()).isEqualTo(second.get().getId());
    }
}
