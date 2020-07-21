from locust import HttpUser, between, task


class WebsiteUser(HttpUser):

    wait_time = between(5, 15)
    
    def on_start(self):
        self.client.post("http://localhost:9000/auth", {
            "username": "admin",
            "password": "xxmaster"
        })
    
    @task
    def index(self):
        self.client.get("/userPage")
        self.client.get("/userRoutes")
        