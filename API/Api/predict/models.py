from django.db import models

class Usuario(models.Model):
    nombre= models.CharField(max_length=100)
    correo= models.CharField(max_length=100)
    password=models.CharField(max_length=100)
    reviews= models.JSONField()
    modelos= models.JSONField()

# Create your models here.
