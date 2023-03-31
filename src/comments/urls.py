
# config urls pattrens

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create/', views.create_comment, name='create_comment'),
    path('<str:pk>/delete/', views.delete_comment, name='delete_comment'),
    path('<str:pk>/like/', views.like_comment, name='like_comment'),
]

