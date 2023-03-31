from django.contrib import admin

from .models import Comment


@admin.register(Comment)
class CommentModelAdmin(admin.ModelAdmin):
    list_display = ('content', 'author', 'parent', 'publish_date')

