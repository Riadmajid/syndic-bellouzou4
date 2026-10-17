package com.example.syndic.zaineb4.data

import com.google.firebase.firestore.IgnoreExtraProperties
import com.google.firebase.firestore.PropertyName

/**
 * Chat message/رسالة دردشة data model
 */
@IgnoreExtraProperties
data class ChatMessage(
    var id: Long = 0L,
    var name: String = "",
    var msg: String = "",
    var time: String = "",
    var likes: Int = 0,
    var dislikes: Int = 0,
    var replies: List<Comment> = emptyList(),
    @get:PropertyName("isPrivate")
    @set:PropertyName("isPrivate")
    @field:PropertyName("isPrivate")
    var isPrivate: Boolean = false,
    var senderUid: String = "",
    var createdAt: Any? = null
) {
    constructor() : this(0L, "", "", "", 0, 0, emptyList(), false, "", null)
}
