from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=100)
    # Code du pays au format ISO 3166-1 alpha-2
    code = models.CharField(max_length=3, default="XXX")
    nickname = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    @property
    def flag(self):
        return f"flags/{self.code}.svg"
