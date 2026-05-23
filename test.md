# API Gateway

## :blue_book: Overview

Dalam ERP microservices, jumlah service akan terus bertambah seperti:

- product-service
- inventory-service
- finance-service
- auth-service

Karena itu dibutuhkan:
- API Gateway
- Eureka Service Registry


# :door: API Gateway

API Gateway adalah pintu utama seluruh request frontend.

Tanpa gateway:

```bash id="a1"
localhost:8081
localhost:8082
localhost:8083
```

Frontend harus mengetahui semua alamat service.

Dengan gateway:

```bash id="a2"
http://gateway-service:8080
```

Frontend cukup akses 1 endpoint saja.


# :gear: Fungsi Gateway

* Single Entry Point
* Routing Request
* JWT/Auth Validation
* Monitoring & Logging
* Load Balancing

Contoh routing:

| Endpoint          | Service           |
| ----------------- | ----------------- |
| /api/products/**  | Product Service   |
| /api/inventory/** | Inventory Service |

Gateway akan meneruskan request ke service yang sesuai.