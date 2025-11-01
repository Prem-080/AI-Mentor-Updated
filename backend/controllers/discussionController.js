import Discussion from '../models/Discussion.js';

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Private
const createDiscussion = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const discussion = await Discussion.create({
      user: req.user._id,
      title,
      description,
      replies: [],
      likes: []
    });

    const populatedDiscussion = await Discussion.findById(discussion._id).populate('user', 'name email');

    res.status(201).json(populatedDiscussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Private
const getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({})
      .populate('user', 'name email')
      .populate('replies.user', 'name email')
      .sort({ createdAt: -1 });

    res.json(discussions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add reply to discussion
// @route   POST /api/discussions/:id/reply
// @access  Private
const addReplyToDiscussion = async (req, res) => {
  try {
    const { text } = req.body;
    const discussionId = req.params.id;

    if (!text) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const newReply = {
      user: req.user._id,
      text,
      likes: [],
      createdAt: new Date()
    };

    discussion.replies.push(newReply);
    await discussion.save();

    const updatedDiscussion = await Discussion.findById(discussionId)
      .populate('user', 'name email')
      .populate('replies.user', 'name email');

    res.json(updatedDiscussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/Unlike discussion
// @route   PUT /api/discussions/:id/like
// @access  Private
const likeDiscussion = async (req, res) => {
  try {
    const discussionId = req.params.id;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const likeIndex = discussion.likes.findIndex(like => like.user.toString() === userId.toString());

    if (likeIndex > -1) {
      // Unlike
      discussion.likes.splice(likeIndex, 1);
    } else {
      // Like
      discussion.likes.push({ user: userId });
    }

    await discussion.save();

    const updatedDiscussion = await Discussion.findById(discussionId)
      .populate('user', 'name email')
      .populate('replies.user', 'name email');

    res.json(updatedDiscussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/Unlike reply
// @route   PUT /api/discussions/:discussionId/reply/:replyId/like
// @access  Private
const likeReply = async (req, res) => {
  try {
    const { discussionId, replyId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const reply = discussion.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const likeIndex = reply.likes.findIndex(like => like.user.toString() === userId.toString());

    if (likeIndex > -1) {
      // Unlike
      reply.likes.splice(likeIndex, 1);
    } else {
      // Like
      reply.likes.push({ user: userId });
    }

    await discussion.save();

    const updatedDiscussion = await Discussion.findById(discussionId)
      .populate('user', 'name email')
      .populate('replies.user', 'name email');

    res.json(updatedDiscussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { createDiscussion, getDiscussions, addReplyToDiscussion, likeDiscussion, likeReply };
