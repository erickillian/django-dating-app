from django.db import models
from django.conf import settings


class Rating(models.Model):
    RATING_CHOICES = [
        ("like", "Like"),
        ("dislike", "Dislike"),
    ]

    rater = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="ratings_given", on_delete=models.CASCADE
    )
    rated = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="ratings_received",
        on_delete=models.CASCADE,
    )
    rating = models.CharField(max_length=7, choices=RATING_CHOICES)
    time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "rating"
        verbose_name = "rating"
        verbose_name_plural = "ratings"
        unique_together = ("rater", "rated")


class Match(models.Model):
    user_one = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="matches_user_one",
        on_delete=models.CASCADE,
    )
    user_two = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="matches_user_two",
        on_delete=models.CASCADE,
    )
    matched_time = models.DateTimeField(auto_now_add=True)
    last_message_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "match"
        verbose_name = "match"
        verbose_name_plural = "matches"
        unique_together = ("user_one", "user_two")


class Message(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="sender", on_delete=models.CASCADE
    )
    match = models.ForeignKey(Match, related_name="messages", on_delete=models.CASCADE)
    message = models.CharField(max_length=160, blank=False)
    time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "message"
        verbose_name = "message"
        verbose_name_plural = "messages"
        get_latest_by = ["time"]  # Ensures the latest message is easily retrievable

    def __str__(self):
        return f"Message from {self.sender} in match {self.match.id}"
