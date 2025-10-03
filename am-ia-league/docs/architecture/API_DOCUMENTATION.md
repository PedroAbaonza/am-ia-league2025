# 🔌 Documentación de API - Aeromexico AI League 2025

Esta documentación describe la arquitectura, endpoints y especificaciones de la API del sistema.

## 🏗️ Arquitectura de API

### Estructura General

```
API Base URL: https://api.am-ia-league.com/v1
Authentication: Bearer Token (JWT)
Content-Type: application/json
```

### Autenticación

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "role": "participant"
  },
  "expiresIn": 3600
}
```

## 👥 Endpoints de Usuarios

### Obtener Perfil de Usuario

```http
GET /users/profile
Authorization: Bearer {token}

Response:
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "participant",
  "squad": {
    "id": "squad-456",
    "name": "Team Alpha"
  },
  "stats": {
    "totalPoints": 1250,
    "rank": 15,
    "completedChallenges": 8
  }
}
```

### Actualizar Perfil

```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "bio": "Software Developer",
  "avatar": "base64-image-data"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

### Listar Usuarios (Admin)

```http
GET /users?page=1&limit=20&role=participant
Authorization: Bearer {admin-token}

Response:
{
  "users": [
    {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "participant",
      "createdAt": "2024-01-15T10:30:00Z",
      "lastActive": "2024-12-15T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## 🏆 Endpoints de Squads

### Obtener Información de Squad

```http
GET /squads/{squadId}
Authorization: Bearer {token}

Response:
{
  "id": "squad-456",
  "name": "Team Alpha",
  "description": "Innovative development team",
  "members": [
    {
      "id": "user-123",
      "name": "John Doe",
      "role": "leader",
      "joinedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "stats": {
    "totalPoints": 5420,
    "rank": 3,
    "completedChallenges": 25
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Crear Squad

```http
POST /squads
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Team Beta",
  "description": "New innovative team",
  "isPrivate": false
}

Response:
{
  "success": true,
  "squad": {
    "id": "squad-789",
    "name": "Team Beta",
    "description": "New innovative team",
    "leaderId": "user-123",
    "isPrivate": false,
    "createdAt": "2024-12-15T15:30:00Z"
  }
}
```

### Unirse a Squad

```http
POST /squads/{squadId}/join
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Successfully joined squad",
  "squad": { /* squad object */ }
}
```

## 📊 Endpoints de Leaderboard

### Obtener Ranking Global

```http
GET /leaderboard/global?type=individual&limit=50
Authorization: Bearer {token}

Response:
{
  "leaderboard": [
    {
      "rank": 1,
      "user": {
        "id": "user-456",
        "name": "Jane Smith",
        "avatar": "avatar-url"
      },
      "points": 2850,
      "completedChallenges": 15,
      "lastActivity": "2024-12-15T14:20:00Z"
    }
  ],
  "userRank": {
    "rank": 25,
    "points": 1250,
    "position": "25/150"
  },
  "lastUpdated": "2024-12-15T15:00:00Z"
}
```

### Obtener Ranking de Squads

```http
GET /leaderboard/squads?limit=20
Authorization: Bearer {token}

Response:
{
  "leaderboard": [
    {
      "rank": 1,
      "squad": {
        "id": "squad-123",
        "name": "Team Alpha",
        "memberCount": 5
      },
      "points": 8750,
      "averagePoints": 1750,
      "completedChallenges": 35
    }
  ],
  "squadRank": {
    "rank": 5,
    "points": 5420,
    "position": "5/25"
  }
}
```

## 🎯 Endpoints de Challenges

### Listar Challenges Disponibles

```http
GET /challenges?status=active&category=coding
Authorization: Bearer {token}

Response:
{
  "challenges": [
    {
      "id": "challenge-123",
      "title": "Algorithm Optimization",
      "description": "Optimize the given algorithm for better performance",
      "category": "coding",
      "difficulty": "medium",
      "points": 500,
      "timeLimit": 3600,
      "startDate": "2024-12-01T00:00:00Z",
      "endDate": "2024-12-31T23:59:59Z",
      "status": "active",
      "participantCount": 45
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12
  }
}
```

### Obtener Detalles de Challenge

```http
GET /challenges/{challengeId}
Authorization: Bearer {token}

Response:
{
  "id": "challenge-123",
  "title": "Algorithm Optimization",
  "description": "Detailed description of the challenge...",
  "instructions": "Step by step instructions...",
  "category": "coding",
  "difficulty": "medium",
  "points": 500,
  "timeLimit": 3600,
  "resources": [
    {
      "type": "document",
      "title": "Algorithm Guide",
      "url": "https://docs.example.com/algo-guide"
    }
  ],
  "submissions": {
    "allowed": 3,
    "remaining": 2
  },
  "userProgress": {
    "status": "in_progress",
    "startedAt": "2024-12-15T10:00:00Z",
    "timeRemaining": 2400
  }
}
```

### Enviar Solución

```http
POST /challenges/{challengeId}/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "solution": "function optimizedAlgorithm() { /* code */ }",
  "language": "javascript",
  "notes": "Implemented using dynamic programming"
}

Response:
{
  "success": true,
  "submission": {
    "id": "submission-789",
    "status": "submitted",
    "submittedAt": "2024-12-15T15:30:00Z",
    "score": null,
    "feedback": null
  },
  "message": "Solution submitted successfully. Results will be available soon."
}
```

## 📈 Endpoints de Estadísticas

### Obtener Estadísticas del Usuario

```http
GET /stats/user/{userId}
Authorization: Bearer {token}

Response:
{
  "user": {
    "id": "user-123",
    "name": "John Doe"
  },
  "overview": {
    "totalPoints": 1250,
    "globalRank": 25,
    "completedChallenges": 8,
    "averageScore": 78.5
  },
  "progress": {
    "thisWeek": {
      "points": 150,
      "challenges": 2
    },
    "thisMonth": {
      "points": 650,
      "challenges": 5
    }
  },
  "categories": [
    {
      "name": "coding",
      "points": 800,
      "challenges": 5,
      "averageScore": 82.0
    },
    {
      "name": "design",
      "points": 450,
      "challenges": 3,
      "averageScore": 75.0
    }
  ],
  "recentActivity": [
    {
      "type": "challenge_completed",
      "challengeId": "challenge-456",
      "challengeTitle": "UI Design Challenge",
      "points": 300,
      "completedAt": "2024-12-14T16:20:00Z"
    }
  ]
}
```

### Obtener Estadísticas Globales

```http
GET /stats/global
Authorization: Bearer {token}

Response:
{
  "overview": {
    "totalUsers": 150,
    "activeUsers": 120,
    "totalSquads": 25,
    "activeChallenges": 12
  },
  "activity": {
    "dailyActiveUsers": 85,
    "weeklyActiveUsers": 120,
    "monthlyActiveUsers": 145
  },
  "challenges": {
    "totalCompleted": 1250,
    "averageCompletionTime": 2400,
    "popularCategories": [
      {
        "name": "coding",
        "count": 450
      },
      {
        "name": "design",
        "count": 320
      }
    ]
  }
}
```

## 🔐 Endpoints de Administración

### Gestión de Usuarios (Admin)

```http
POST /admin/users/{userId}/role
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "role": "admin"
}

Response:
{
  "success": true,
  "message": "User role updated successfully",
  "user": { /* updated user object */ }
}
```

### Gestión de Challenges (Admin)

```http
POST /admin/challenges
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "title": "New Challenge",
  "description": "Challenge description",
  "category": "coding",
  "difficulty": "hard",
  "points": 750,
  "timeLimit": 7200,
  "startDate": "2024-12-20T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}

Response:
{
  "success": true,
  "challenge": { /* created challenge object */ }
}
```

## 📁 Endpoints de Archivos

### Subir Avatar

```http
POST /files/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- file: [image file]

Response:
{
  "success": true,
  "url": "https://cdn.example.com/avatars/user-123.jpg",
  "message": "Avatar uploaded successfully"
}
```

### Descargar Plantilla (Admin)

```http
GET /admin/templates/{templateType}
Authorization: Bearer {admin-token}

Response: [File download]
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="users-template.xlsx"
```

## 🔔 Endpoints de Notificaciones

### Obtener Notificaciones

```http
GET /notifications?unread=true&limit=20
Authorization: Bearer {token}

Response:
{
  "notifications": [
    {
      "id": "notif-123",
      "type": "challenge_completed",
      "title": "Challenge Completed!",
      "message": "You completed the Algorithm Optimization challenge",
      "data": {
        "challengeId": "challenge-123",
        "points": 500
      },
      "read": false,
      "createdAt": "2024-12-15T14:30:00Z"
    }
  ],
  "unreadCount": 5
}
```

### Marcar como Leída

```http
PUT /notifications/{notificationId}/read
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Notification marked as read"
}
```

## 🚨 Códigos de Error

### Códigos HTTP Estándar

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Formato de Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The provided data is invalid",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  },
  "timestamp": "2024-12-15T15:30:00Z",
  "path": "/users/profile"
}
```

### Códigos de Error Personalizados

- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `AUTH_003` - Insufficient permissions
- `USER_001` - User not found
- `USER_002` - Email already exists
- `SQUAD_001` - Squad not found
- `SQUAD_002` - Squad is full
- `CHALLENGE_001` - Challenge not found
- `CHALLENGE_002` - Challenge expired
- `CHALLENGE_003` - Maximum submissions reached

## 📊 Rate Limiting

### Límites por Endpoint

- **Authentication**: 5 requests/minute
- **General API**: 100 requests/minute
- **File Upload**: 10 requests/minute
- **Admin API**: 200 requests/minute

### Headers de Rate Limit

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## 🔄 Versionado de API

### Estrategia de Versionado

- URL Path: `/v1/`, `/v2/`
- Backward compatibility mantenida por 12 meses
- Deprecation notices con 6 meses de anticipación

### Changelog

- **v1.0** - Initial release
- **v1.1** - Added squad management
- **v1.2** - Enhanced statistics endpoints
- **v1.3** - Added notification system

## 🧪 Testing de API

### Postman Collection

```bash
# Importar colección
curl -o am-ia-league-api.postman_collection.json \
  https://api.example.com/docs/postman-collection
```

### Ejemplos con cURL

```bash
# Login
curl -X POST https://api.am-ia-league.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get profile
curl -X GET https://api.am-ia-league.com/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Recursos Adicionales

### Documentación Interactiva

- **Swagger UI**: https://api.am-ia-league.com/docs
- **Postman**: [Collection Link]
- **Insomnia**: [Workspace Link]

### SDKs Disponibles

- **JavaScript/TypeScript**: `npm install @am-ia-league/api-client`
- **Python**: `pip install am-ia-league-api`

---

**Última actualización**: Diciembre 2024  
**Versión de API**: v1.3  
**Mantenido por**: Equipo de Backend
