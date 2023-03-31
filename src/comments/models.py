from django.db import models

# Create your models here.


class Comment(models.Model):
    content = models.TextField()
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    likes = models.ManyToManyField('auth.User', related_name='comment_likes', blank=True)
    publish_date = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.content
    
    @property
    def like_count(self):
        return self.likes.count()
    

    @property
    def children(self):
        return self.comment_set.all().order_by('-publish_date')

    @property
    def has_children(self):
        return self.children.count() > 0
    

    @property
    def is_child(self):
        return self.parent != None
    
