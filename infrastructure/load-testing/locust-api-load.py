from locust import HttpUser, task, between

class AuraApiLoadUser(HttpUser):
    wait_time = between(0.1, 0.5)

    @task(3)
    def fetch_recommendations(self):
        self.client.get("/api/v1/ai/recommendations?userId=u-locust-101")

    @task(5)
    def fetch_trending_rooms(self):
        self.client.get("/api/v1/ai/trending-rooms")

    @task(2)
    def generate_rtc_token(self):
        self.client.post("/api/v1/rtc/token", json={
            "channelId": "room-load-101",
            "userId": "u-locust-101",
            "role": "AUDIENCE"
        })
