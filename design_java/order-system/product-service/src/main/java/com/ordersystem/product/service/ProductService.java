package com.ordersystem.product.service;

import com.ordersystem.product.model.Product;
import com.ordersystem.product.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);
    private static final String CACHE_PREFIX = "product:";

    private final ProductRepository repository;
    private final RedisTemplate<String, Object> redisTemplate;

    public ProductService(ProductRepository repository, RedisTemplate<String, Object> redisTemplate) {
        this.repository = repository;
        this.redisTemplate = redisTemplate;
    }

    public Optional<Product> getProduct(String id) {
        // Check cache first
        String key = CACHE_PREFIX + id;
        Object cached = redisTemplate.opsForValue().get(key);
        if (cached instanceof Product p) {
            log.debug("Cache hit for product {}", id);
            return Optional.of(p);
        }

        // Cache miss — load from DB
        Optional<Product> product = repository.findById(id);
        product.ifPresent(p -> redisTemplate.opsForValue().set(key, p, Duration.ofMinutes(10)));
        return product;
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    @Transactional
    public boolean reserveInventory(String productId, int quantity) {
        var product = repository.findByIdForUpdate(productId);
        if (product.isEmpty()) return false;

        boolean reserved = product.get().reserveStock(quantity);
        if (reserved) {
            repository.save(product.get());
            evictCache(productId);
            log.info("Reserved {} units of product {}", quantity, productId);
        }
        return reserved;
    }

    @Transactional
    public void releaseInventory(String productId, int quantity) {
        var product = repository.findByIdForUpdate(productId);
        product.ifPresent(p -> {
            p.releaseStock(quantity);
            repository.save(p);
            evictCache(productId);
            log.info("Released {} units of product {}", quantity, productId);
        });
    }

    public Product createProduct(Product product) {
        Product saved = repository.save(product);
        redisTemplate.opsForValue().set(CACHE_PREFIX + saved.getId(), saved, Duration.ofMinutes(10));
        return saved;
    }

    private void evictCache(String productId) {
        redisTemplate.delete(CACHE_PREFIX + productId);
    }
}
