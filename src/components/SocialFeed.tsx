import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Share2, Bookmark, Send, Calendar, Sparkles, Image, ShieldAlert, BadgeCheck } from 'lucide-react';
import { FeedPost } from '../types';

interface SocialFeedProps {
  posts: FeedPost[];
  currentUserId: string;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onCreatePost: (content: string, imageUrl?: string) => void;
}

export function SocialFeed({ posts, currentUserId, onLikePost, onAddComment, onCreatePost }: SocialFeedProps) {
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [commentContents, setCommentContents] = useState<{ [postId: string]: string }>({});
  const [showImageInput, setShowImageInput] = useState(false);

  // Filter bookmarked posts state
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [localBookmarks, setLocalBookmarks] = useState<string[]>([]);

  const handleToggleBookmark = (postId: string) => {
    if (localBookmarks.includes(postId)) {
      setLocalBookmarks(localBookmarks.filter(id => id !== postId));
    } else {
      setLocalBookmarks([...localBookmarks, postId]);
    }
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    onCreatePost(newPostContent, newPostImage);
    setNewPostContent('');
    setNewPostImage('');
    setShowImageInput(false);
  };

  const handlePublishComment = (postId: string) => {
    const text = commentContents[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text);
    setCommentContents({ ...commentContents, [postId]: '' });
  };

  const displayedPosts = showBookmarksOnly 
    ? posts.filter(p => localBookmarks.includes(p.id))
    : posts;

  return (
    <div id="social_feed_panel" className="max-w-4xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Create action and feed list */}
        <div className="lg:col-span-8 space-y-4 text-left">
          
          {/* Create Post Card */}
          <div className="bg-sleek-card border border-sleek-main rounded-2xl p-5 shadow-sm">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-sleek-input shrink-0"></div>
              <div className="flex-1">
                <textarea
                  id="post_content_input"
                  rows={2}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a professional achievement or project..."
                  className="w-full bg-transparent border-none resize-none focus:ring-0 text-sleek-main placeholder:text-sleek-muted text-sm focus:outline-none"
                />

                {showImageInput && (
                  <input
                    type="text"
                    placeholder="Enter image URL (e.g., https://images.unsplash.com/...)"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    className="w-full mt-2 bg-sleek-input border border-sleek-input rounded-lg p-2 text-xs text-sleek-main focus:outline-none focus:border-indigo-500 font-sans"
                  />
                )}

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-sleek-main font-sans text-xs">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowImageInput(!showImageInput)}
                      className="flex items-center gap-2 text-xs text-sleek-muted hover:text-sleek-heading"
                    >
                      <Image className="w-4 h-4 text-indigo-400" /> Image
                    </button>
                  </div>
                  
                  <button
                    id="btn_publish_post"
                    onClick={handlePublishPost}
                    className="px-6 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-full transition-all cursor-pointer"
                  >
                    Post
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Social posts listing */}
          {displayedPosts.length === 0 ? (
            <div className="p-12 text-center text-xs text-sleek-muted border border-sleek-main bg-sleek-card rounded-2xl font-sans">
              No feed posts available here. Try creating a new post above!
            </div>
          ) : (
            displayedPosts.map((post) => {
              const isLiked = post.likes.includes(currentUserId);
              const isBookmarked = localBookmarks.includes(post.id);

              return (
                <div key={post.id} className="bg-sleek-card border border-sleek-main rounded-2xl overflow-hidden shadow-2xl space-y-4 p-5">
                  
                  {/* Post author header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        referrerPolicy="no-referrer"
                        src={post.userAvatar}
                        alt={post.userName}
                        className="w-10 h-10 object-cover rounded-full border border-sleek-main"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sleek-heading leading-none">{post.userName}</span>
                          <BadgeCheck className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-[11px] text-sleek-muted italic uppercase mt-0.5 block truncate max-w-[200px] font-sans">{post.userHeadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-sleek-muted px-3 py-1 bg-sleek-input rounded-full border border-sleek-input">Project Showcase</span>
                      <button
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                          isBookmarked 
                            ? 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5 shadow-sm'
                            : 'border-sleek-input hover:border-sleek-main text-sleek-muted'
                        }`}
                        title={isBookmarked ? "Remove Bookmark" : "Bookmark Post"}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Content body */}
                  <div className="text-sm text-sleek-main leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </div>

                  {/* Post visual attachments */}
                  {post.imageUrl && (
                    <div className="mx-5 my-2 p-4 bg-sleek-input border border-sleek-input rounded-xl flex gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg border border-sleek-input flex items-center justify-center shrink-0">
                        <img
                          referrerPolicy="no-referrer"
                          src={post.imageUrl}
                          alt="Showcase screenshot"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider">PROJECT ASSET</span>
                        <h4 className="text-sleek-heading font-medium text-xs mt-1">careerverse-showcase-preview</h4>
                        <p className="text-[11px] text-sleek-muted mt-1">Live design mockup resource</p>
                      </div>
                    </div>
                  )}

                  {/* Interactions counts bar */}
                  <div className="flex justify-between items-center text-[10px] text-sleek-muted font-mono pb-2 border-b border-sleek-main">
                    <span>{post.likes.length} likes</span>
                    <span>{post.comments.length} comments · {post.repostCount} reposts</span>
                  </div>

                  {/* Actions bar buttons */}
                  <div className="grid grid-cols-3 gap-2 py-0.5 text-center text-xs font-semibold text-sleek-muted font-sans">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isLiked 
                          ? 'bg-indigo-500/10 border-indigo-500/10 text-indigo-400' 
                          : 'border-transparent hover:border-sleek-input hover:bg-sleek-input text-sleek-muted'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Like
                    </button>
                    <button
                      className="flex items-center justify-center gap-1.5 py-1.5 border border-transparent rounded-lg text-sleek-muted hover:bg-sleek-input cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Comment
                    </button>
                    <button
                      onClick={() => {
                        // Safe toast feedback instead of alert popup
                        onCreatePost(`Re-sharing project milestone by ${post.userName}: "${post.content.slice(0, 40)}..."`);
                      }}
                      className="flex items-center justify-center gap-1.5 py-1.5 border border-transparent rounded-lg text-sleek-muted hover:border-sleek-input hover:bg-sleek-input cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Repost
                    </button>
                  </div>

                  {/* Comments lists block */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-sleek-main">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-sleek-input/40 border border-sleek-main rounded-xl flex items-start gap-2.5">
                          <img
                            referrerPolicy="no-referrer"
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-7 h-7 object-cover rounded-full border border-sleek-input"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <span className="font-sans font-semibold text-xs text-sleek-heading">{comment.userName}</span>
                              <span className="text-[9px] text-sleek-muted font-mono">1h ago</span>
                            </div>
                            <p className="text-[11px] text-sleek-muted font-sans leading-relaxed mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add dynamic Comment Input */}
                  <div className="flex gap-2.5 pt-2">
                    <input
                      type="text"
                      placeholder="Write a constructive comment..."
                      value={commentContents[post.id] || ''}
                      onChange={(e) => setCommentContents({ ...commentContents, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePublishComment(post.id);
                      }}
                      className="flex-1 bg-sleek-input border border-sleek-input rounded-lg px-3 py-2 text-xs text-sleek-main focus:outline-none focus:border-indigo-500 font-sans"
                    />
                    <button
                      onClick={() => handlePublishComment(post.id)}
                      className="p-2 bg-sleek-input hover:bg-sleek-active border border-sleek-input rounded-lg cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-sleek-muted" />
                    </button>
                  </div>

                </div>
              );
            })
          )}

        </div>

        {/* Right Side: Feed filtering options and premium ad */}
        <div className="lg:col-span-4 space-y-4 text-left font-sans text-xs">
          
          {/* Feed Filter Panel */}
          <div className="bg-sleek-card border border-sleek-main p-4 rounded-xl">
            <h4 className="font-semibold text-sleek-heading mb-2.5">Filter Feed</h4>
            <div className="space-y-1.5">
              <button
                onClick={() => setShowBookmarksOnly(false)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer border ${
                  !showBookmarksOnly ? 'bg-sleek-active text-sleek-heading border-sleek-input' : 'text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input border-transparent'
                }`}
              >
                🌐 Global Social Feed
              </button>
              <button
                onClick={() => setShowBookmarksOnly(true)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer border ${
                  showBookmarksOnly ? 'bg-sleek-active text-sleek-heading border-sleek-input' : 'text-sleek-muted hover:text-sleek-heading hover:bg-sleek-input border-transparent'
                }`}
              >
                🔖 Bookmarked Posts ({localBookmarks.length})
              </button>
            </div>
          </div>

          {/* Guidelines info */}
          <div className="p-4 bg-sleek-card border border-sleek-main rounded-xl space-y-2 text-sleek-muted">
            <div className="flex items-center gap-1 text-sleek-heading font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Branding Guide
            </div>
            <p className="text-[11px] leading-relaxed">
              When publishing project milestones, include quantitative achievements (e.g., speed up, size reduction) to capture the attention of corporate scouts!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
