package com.curo.provider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/providers")
@CrossOrigin(origins = "*")
public class ProviderController {
    @Autowired private ProviderService providerService;

    @GetMapping
    public ResponseEntity<List<Provider>> listProviders(
            @RequestParam(required = false) String speciality,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng
    ) {
        try {
            List<Provider> providers = providerService.search(speciality, lat, lng);
            return ResponseEntity.ok(providers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProvider(@PathVariable Long id) {
        try {
            Provider provider = providerService.getById(id);
            return ResponseEntity.ok(provider);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Provider> createProvider(@RequestBody Provider provider) {
        try {
            Provider saved = providerService.save(provider);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Provider> updateProvider(@PathVariable Long id, @RequestBody Provider provider) {
        try {
            provider.setId(id);
            Provider updated = providerService.save(provider);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}