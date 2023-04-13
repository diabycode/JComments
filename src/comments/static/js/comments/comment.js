import {createElement, login_required, showTopReturnBtn, hideTopReturnBtn} from "./utils.js"

document.addEventListener("DOMContentLoaded", (e) => {
    if (localStorage.getItem("prevScrollLevel")) {
        window.scrollTo({
            top: localStorage.getItem("prevScrollLevel"),
            behavior: "smooth"
        })
        localStorage.clear()
    }
})


// textarea autoresize
function autoResize(textareaElement) {
    textareaElement.focus()

    textareaElement.addEventListener("keyup", () => {
        textareaElement.style.height = "auto"
        textareaElement.style.height = textareaElement.scrollHeight + "px"
    })
}


class Comment {
    constructor(id, content, author, like_count, publish_date, parent_id) {
        this.id = id
        this.content = content
        this.author = author
        this.publish_date = publish_date
        this.parent_id = parent_id
    }

    delete() {

        if (window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
            fetch(`/comments/${this.id}/delete/`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })
                .then((response) => {
                    if (response.ok) {
                        this.domShower.remove()
                        localStorage.setItem("prevScrollLevel",  window.scrollY)
                        window.location.reload()
                    }
                })
                .catch((error) => {
                    login_required()
                })
        }

    }

    updateLikers () {
        fetch(`/comments/${this.id}/like/`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        })
            .then(response => response.json())
            .then((data) => {
                this.domShower.querySelector(".action p > span").innerText = data.likes
                
            })
            .catch((error) => {
                login_required()
            })
    }

    get ischild () {
        if (this.parent_id) {
            return true
        }
        return false
    }

    get domShower() {
        return document.querySelector(`[data-id="${this.id}"]`)
    }

    get shower() {
        const template = document.querySelector("#comment-template").content.cloneNode(true)

        template.querySelector(".infos h3").innerText = this.author
        template.querySelector(".infos p").innerText = this.publish_date
        template.querySelector(".content p").innerText = this.content
        template.querySelector(".action p > span").innerText = this.like_count

        const commentWrapper = createElement("div", {class: "comment", "data-id": this.id, "data-parent": this.parent_id})
        commentWrapper.appendChild(template)
        return commentWrapper
    }

    get DOMParent () {
        return document.querySelector(`.comment[data-id='${this.parent_id}']`)
    }

    addInDOM() {
        if (this.ischild) {
            this.DOMParent.insertAdjacentElement("afterend", this.shower)
            return this.domShower
        }
        document.querySelector("#all-comments").prepend(this.shower)
        return this.domShower
    }

    static createCommentFromDOM(commentDOM) {
        const comment = new Comment()

        comment.id = commentDOM.dataset.id
        comment.content = commentDOM.querySelector(".content p").innerText
        comment.author = commentDOM.querySelector(".infos h3").innerText
        comment.publish_date = commentDOM.querySelector(".infos p").innerText
        comment.like_count = commentDOM.querySelector(".action p > span").innerText
        comment.parent_id = commentDOM.dataset.parent

        return comment
    }

}


class Comments {
    constructor() {
        this.comments = []
        this.initCommentsList()
        this.listenToCommentForm()
        this.updateShowers()
        this.addListeners()

        // textarea autoresize
        autoResize(this.form.querySelector("textarea"))
    }

    handleLike(e) {
        e.preventDefault()
        const comment = Comment.createCommentFromDOM(e.target.closest(".comment"))
        comment.updateLikers()
        e.target.classList.toggle("liked")
    }

    handleReplyForm (parent_id, e) {
        e.preventDefault()

        const comment_content = e.target.querySelector("textarea").value
        if (comment_content === "") {return}
        const csrftoken = e.target.querySelector("input[name='csrfmiddlewaretoken']").value

        this.create(comment_content, parent_id, csrftoken)
            .then(() => {
                e.target.remove()
                setTimeout(() => {
                    this.updateShowers()
                    this.addListeners()
                }, 2000)
                
            })
    }

    handleReply(e) {
        e.preventDefault()
        const replyForm = createElement("div", {class: "reply-form"})
        replyForm.appendChild(document.querySelector("#response-form-template").content.cloneNode(true))

        // add the replyForm just after the comment to reply
        const parentElement = e.target.closest(".comment")
        if (document.querySelector(".reply-form")){document.querySelector(".reply-form").remove()}
        parentElement.insertAdjacentElement("afterend", replyForm)
        autoResize(replyForm.querySelector("textarea"))
        replyForm.firstElementChild.addEventListener("submit", this.handleReplyForm.bind(this, parentElement.dataset.id))

        replyForm.firstElementChild.querySelector(".cancel-btn").addEventListener("click", (e) => {
            e.preventDefault()
            replyForm.remove()
        })
    }

    handleDelete(e) {
        e.preventDefault()
        const comment = Comment.createCommentFromDOM(e.target.closest(".comment"))
        comment.delete()
    }

    addListeners() {
        // like button
        document.querySelectorAll(".action .like-btn").forEach((button) => {
            button.addEventListener("click", this.handleLike.bind(this))
        })

        // reply button
        document.querySelectorAll(".action .response-btn").forEach((button) => {
            button.addEventListener("click", this.handleReply.bind(this))
        })

        // delete button
        document.querySelectorAll(".action .delete-btn").forEach((button) => {
            button.addEventListener("click", this.handleDelete.bind(this))
        })
    }

    getCommentParent(comment) {
        return this.comments.find((c) => c.id === comment.parent_id)
    }

    updateShowers() {
        const childComments = this.comments.filter((comment) => comment.ischild === true)

        childComments.forEach((childComment) => {
            const containerWidth = this.container.clientWidth
            if (!this.getCommentParent(childComment)) {
                localStorage.setItem("prevScrollLevel",  window.scrollY)
                window.location.reload()
                return
            }
            const parentWidth = this.getCommentParent(childComment).domShower.clientWidth
            
            const offsetWidth = parentWidth / containerWidth 
            
            const childNewWidth = `${(offsetWidth * 100) - 5}%`

            childComment.domShower.style.width = childNewWidth
        })
        
    }

    clearForm() {
        this.form.querySelector("textarea").value = ""
    }

    initCommentsList() {
        document.querySelectorAll(".comment").forEach((comment) => {
            const commentObject = new Comment()

            commentObject.id = comment.dataset.id
            commentObject.content = comment.querySelector(".content p").innerText
            commentObject.author = comment.querySelector(".infos h3").innerText
            commentObject.publish_date = comment.querySelector(".infos p").innerText
            commentObject.like_count = comment.querySelector(".action p > span").innerText
            commentObject.parent_id = comment.dataset.parent

            this.comments.push(commentObject)
        })
    }

    getAllComments() {
        return this.comments
    }

    getCommentById(id) {
        return this.comments.find((comment) => comment.id === id)
    }

    async create (comment_content, parent_id, csrftoken) {
        const data = {
            content: comment_content,
            parent_id: parent_id,
        }

        // create comment in db
        await fetch("/comments/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((data) => {
                const commentData = data.object
                const comment = new Comment()
                
                comment.id = commentData.id
                comment.content = commentData.content
                comment.author = commentData.author
                comment.publish_date = commentData.publish_date
                comment.parent_id = commentData.parent_id
                comment.like_count = commentData.likes

                this.comments.push(comment)
                comment.addInDOM()
                
                this.clearForm()
                this.updateShowers()
            })
            .catch((error) => {
                login_required()
            })
    }

    async handleCommentForm (e) {
        e.preventDefault()
        const content = e.target.querySelector("textarea").value
        if (content === "") {return}
        const parentId = null
        const csrftoken = e.target.querySelector("input[name=csrfmiddlewaretoken]").value

        await this.create(content, parentId, csrftoken)
        setTimeout(() => {
            this.addListeners()
        }, 2000)
    }

    listenToCommentForm() {
        this.form.addEventListener("submit", this.handleCommentForm.bind(this))
        console.log("Comment form listened")
        
    }

    get form () {
        return document.querySelector("#comment_form")
    }

    get container() {
        return document.querySelector("#all-comments")
    }
}


const comments = new Comments()


// top button
document.querySelector(".to-top").addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
})

window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
        showTopReturnBtn()
    } else {
        hideTopReturnBtn()
    }
})



