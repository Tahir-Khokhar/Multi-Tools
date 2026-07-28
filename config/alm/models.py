from django.db import models

class Alarm(models.Model):
    time = models.CharField(max_length=5)
    label = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_ringing = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.label} - {self.time}"
