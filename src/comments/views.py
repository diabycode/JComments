from django.shortcuts import render
from .models import Comment
from django.http import JsonResponse

import json


def get_comments(comment_list):
    all_comments = []
    for comment in comment_list:
        all_comments.append(comment)
        children = comment.children.all()
        if children:
            all_comments.extend(get_comments(children))
    return all_comments


def index(request):
    # get all comments
    comments = get_comments(
        [c for c in Comment.objects.all().order_by('-publish_date') if not c.parent]
    )
    
    # render the index template
    return render(request, 'comments/index.html', {'comments': comments})


# create a new comment 
def create_comment(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        comment_content = body.get("content")
        comment_parent = body.get("parent_id")


        # create a new comment and save it
        comment = Comment()
        comment.content = comment_content
        comment.author = request.user
        if comment_parent:
            comment.parent = Comment.objects.get(pk=comment_parent)
        comment.save()

        return JsonResponse(
            {
                'object': {
                    "id": comment.pk,
                    "content": comment.content,
                    "author": comment.author.username,
                    "likes": 0,
                    "publish_date": comment.publish_date.strftime("%b. %d, %Y, %I:%M %p"),
                    "parent_id": comment_parent if comment_parent else None
                },
                'status': 'ok',
            }
        )
    return JsonResponse({'status': 'error'})


def delete_comment(request, pk):
    if request.method == 'GET':
        # delete a comment
        comment = Comment.objects.get(pk=pk)
        comment.delete()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'})


def like_comment(request, pk):
    if request.method == 'GET':

        comment = Comment.objects.get(pk=pk)
        if request.user in comment.likes.all():
            comment.likes.remove(request.user)
        else:
            comment.likes.add(request.user)

        return JsonResponse({
            'status': 'ok',
            'likes': comment.like_count,
        })
    return JsonResponse({'status': 'error'})




