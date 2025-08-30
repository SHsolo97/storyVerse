Comprehensive System Design for StoryVerse

This design will cover functional and non-functional requirements, high-level architecture, data models, API design, and key components.

---

### 1. Core Functional Requirements

*   **User Management:** Secure user registration (email/password, social logins), login, and profile management.
*   **Story Library:** A browsable catalog of interactive stories ("books"), organized by genre, popularity, new releases, etc.
*   **Interactive Gameplay:**
    *   Users play through stories chapter by chapter.
    *   Gameplay consists of scenes with dialogue, character art, and backgrounds.
    *   Users make choices that influence the story's direction, relationships, and outcomes.
    *   Some choices are "premium" and require virtual currency.
*   **Currency System:**
    *   **Keys:** Consumed to start a new chapter. Keys regenerate over time up to a cap.
    *   **Diamonds/Gems (Premium Currency):** Used to unlock premium choices, special outfits, or exclusive scenes. Purchased with real money or earned through rewards.
*   **Player Progress:** The system must save a player's progress in every story, including choices made and relationship stats.
*   **In-App Purchases (IAP):** A store to buy packs of diamonds/gems.
*   **Content Delivery:** The system must efficiently deliver new books and chapters to all users without requiring an app update for every release.

### 2. Non-Functional Requirements (NFRs)

*   **Scalability:** Must handle millions of concurrent users, especially during new chapter releases. The system should be read-heavy (fetching story content) and write-moderate (saving player progress).
*   **Availability:** High uptime is critical. Users expect to be able to play at any time.
*   **Low Latency:** Story assets (images, scripts) and scene data must load quickly to ensure a smooth user experience.
*   **Consistency:** Player progress and currency balances must be strongly consistent. A user cannot lose their purchased items or progress.
*   **Security:** Protect user data (PII), payment information, and prevent cheating (e.g., getting free diamonds).

---

### 3. High-Level Architecture

A **Microservices Architecture** is the ideal choice. It decouples core functionalities, allowing them to be developed, deployed, and scaled independently.



#### Core Components:

1.  **Client App (iOS/Android):** The user-facing application, likely built with a cross-platform framework like React Native or a native engine like Unity. Responsible for rendering scenes, handling user input, and managing local assets.
2.  **API Gateway:** A single entry point for all client requests. It routes requests to the appropriate microservice, handles authentication, rate limiting, and basic request validation.
3.  **User Service:** Manages all user-related concerns: authentication (sign-up, login), profile data, and user settings.
4.  **Story Service:** Acts as the story catalog. It provides metadata about all available books and chapters (titles, descriptions, cover art URLs, genres). This is a primarily read-only service.
5.  **Gameplay Service:** The state machine of the app. It processes player choices, updates their progress, and determines the next scene to be shown.
6.  **Inventory & Currency Service:** Manages a user's keys and diamonds. Handles the logic for key regeneration over time and deducts currency for purchases.
7.  **Payment Service:** Integrates with third-party payment gateways (Apple App Store, Google Play Store) to handle in-app purchases securely.
8.  **CDN (Content Delivery Network):** Crucial for performance. All static story assets (character sprites, backgrounds, music, and the story script files themselves) are stored here.
9.  **Story Authoring Tool:** An internal web-based tool for writers and artists to create, edit, and publish stories. This is a critical part of the content pipeline.

---

### 4. Data Schema and Database Design

We'll use a mix of SQL and NoSQL databases to leverage their respective strengths.

*   **Relational Database (e.g., PostgreSQL, MySQL):** For structured, transactional data.
    *   **Services:** User, Inventory, Payment.
*   **NoSQL Document Database (e.g., MongoDB, AWS DynamoDB):** For flexible, hierarchical story content.
    *   **Services:** Story, Gameplay.

#### Relational Schema (PostgreSQL)

```sql
-- User Service
CREATE TABLE Users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory & Currency Service
CREATE TABLE UserInventory (
    user_id UUID PRIMARY KEY REFERENCES Users(user_id),
    diamonds_balance INT DEFAULT 0,
    keys_balance INT DEFAULT 5,
    last_key_refill_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story Service (Metadata)
CREATE TABLE Stories (
    story_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(255),
    genre VARCHAR(50),
    is_published BOOLEAN DEFAULT FALSE
);

CREATE TABLE Chapters (
    chapter_id UUID PRIMARY KEY,
    story_id UUID REFERENCES Stories(story_id),
    chapter_number INT NOT NULL,
    title VARCHAR(255),
    UNIQUE(story_id, chapter_number)
);
```

#### NoSQL Schema (JSON documents in MongoDB/DynamoDB)

This is where the core gameplay logic lives.

**1. Player Progress Document (`PlayerProgress` Collection)**

*Keyed by `user_id` and `story_id`.*

```json
{
  "_id": "user123_story456",
  "userId": "user123",
  "storyId": "story456",
  "currentChapterId": "chapter789",
  "currentSceneId": "scene_C",
  "unlockedOutfits": ["outfit_premium_ballgown"],
  "relationshipScores": {
    "liam": 25,
    "drake": -10
  },
  "flags": {
    "has_magic_key": true,
    "revealed_secret": false
  }
}
```

**2. Story Content Document (`StoryContent` Collection)**

*Keyed by `chapter_id`. This entire document can be cached on the CDN.*

```json
{
  "_id": "chapter789",
  "storyId": "story456",
  "chapterNumber": 1,
  "scenes": {
    "scene_A": {
      "background": "cdn.url/bg_castle_gate.jpg",
      "music": "cdn.url/tense_music.mp3",
      "timeline": [
        { "type": "dialogue", "character": "Guard", "text": "Halt! Who goes there?" },
        { "type": "dialogue", "character": "MC", "text": "I am here to see the Prince." }
      ],
      "nextSceneId": "scene_B"
    },
    "scene_B": {
      "background": "cdn.url/bg_castle_gate.jpg",
      "timeline": [
        { "type": "dialogue", "character": "Guard", "text": "The Prince is busy. What is your purpose?" }
      ],
      "choice": {
        "prompt": "How do you respond?",
        "options": [
          { "id": "opt1", "text": "Demand to be let in.", "nextSceneId": "scene_C_confront" },
          { "id": "opt2", "text": "Try to persuade him.", "nextSceneId": "scene_C_persuade" },
          { "id": "opt3", "text": "Offer him a bribe (20 Diamonds)", "cost": 20, "nextSceneId": "scene_C_bribe", "flag": "bribed_guard" }
        ]
      }
    },
    "scene_C_persuade": {
        /* ... more scene content ... */
    }
  }
}
```

---

### 5. API Design (RESTful Endpoints)

`base_url: https://api.storyapp.com/v1`

**User Service**
*   `POST /auth/register`
*   `POST /auth/login`
*   `GET /user/me` (Authenticated)

**Story Service**
*   `GET /stories` (Returns a paginated list of all stories)
*   `GET /stories/{storyId}` (Returns metadata for a single story and its chapters)

**Inventory Service**
*   `GET /inventory` (Returns current key and diamond balance for the user)

**Gameplay Service**
*   `POST /play/start` - Body: `{ "chapterId": "..." }`. Consumes a key (via Inventory Service). Returns the first scene's content.
*   `POST /play/makeChoice` - Body: `{ "userId": "...", "storyId": "...", "sceneId": "...", "choiceId": "..." }`.
    *   This is the core gameplay endpoint.
    *   It validates if the user can afford a premium choice (by calling Inventory Service).
    *   It updates the `PlayerProgress` document.
    *   It returns the content of the *next* scene based on the choice.

---
### 6. CMS for building stories can be ignored at this point as we would be using external tools for creating stories.


### 7. Scalability and Performance Considerations

*   **CDN is King:** The vast majority of user requests are for static content. Offloading this to a CDN (like AWS CloudFront or Cloudflare) dramatically reduces latency and server load. The client should download the entire chapter JSON from the CDN when a chapter begins.
*   **Stateless Services:** All microservices (except databases) should be stateless. This allows us to horizontally scale by simply adding more instances behind a load balancer.
*   **Database Scaling:**
    *   **PostgreSQL:** Use read replicas for the Story Service, which is highly read-intensive. The primary instance handles writes.
    *   **DynamoDB/MongoDB:** These are designed for horizontal scaling and can handle the write load from player progress updates.
*   **Caching:** Use an in-memory cache like **Redis** for:
    *   User sessions.
    *   Frequently accessed user profiles/inventories.
    *   "Hot" story metadata to reduce database hits.
*   **Asynchronous Operations:** For non-critical tasks like sending a "Welcome" email on registration, use a message queue (like RabbitMQ or AWS SQS) to process them asynchronously.

---

### 8. Technology Stack Summary

*   **Client:** React Native (cross-platform) for mobile and React JS for the web player.
*   **Backend Microservices:** NestJS.
*   **API Gateway:** Kong, AWS API Gateway.
*   **Databases:**
    *   PostgreSQL (AWS RDS) for structured data.
    *   MongoDB (Atlas) or DynamoDB for story content/progress.
*   **Cache:** Redis (AWS ElastiCache).
*   **CDN:** AWS CloudFront.
*   **Object Storage:** AWS S3 for all static assets.
*   **Containerization & Orchestration:** Docker & Kubernetes (or AWS ECS/EKS) for deploying and managing microservices.