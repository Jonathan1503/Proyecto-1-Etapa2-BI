from django.urls import path,include
from predict import views


urlpatterns = [
   path('login', views.login, name='login'),
   path('register', views.register, name='register'),
   path('csv', views.prediccionCsv, name='prediccionCsv'),
   path('txt', views.prediccionTxt, name='prediccionTxt'),
   path('modelo', views.entrenamiento, name='entrenamiento'),
   path('lastreviews', views.lastReviews, name='lastReviews'),

]