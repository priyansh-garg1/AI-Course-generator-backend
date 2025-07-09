import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  progress: {
    completedTopics: [{
      chapterOrder: Number,
      topicIndex: Number,
      completedAt: {
        type: Date,
        default: Date.now
      }
    }],
    currentChapter: {
      type: Number,
      default: 0
    },
    currentTopic: {
      type: Number,
      default: 0
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now
    }
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to ensure one enrollment per user per course
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Calculate completion percentage
enrollmentSchema.methods.getCompletionPercentage = function() {
  if (!this.progress.completedTopics || this.progress.completedTopics.length === 0) {
    return 0;
  }
  
  // This will be calculated based on total topics in the course
  return this.progress.completedTopics.length;
};

// Check if a topic is completed
enrollmentSchema.methods.isTopicCompleted = function(chapterOrder, topicIndex) {
  return this.progress.completedTopics.some(topic => 
    topic.chapterOrder === chapterOrder && topic.topicIndex === topicIndex
  );
};

// Mark topic as completed
enrollmentSchema.methods.markTopicCompleted = function(chapterOrder, topicIndex) {
  const existingTopic = this.progress.completedTopics.find(topic => 
    topic.chapterOrder === chapterOrder && topic.topicIndex === topicIndex
  );
  
  if (!existingTopic) {
    this.progress.completedTopics.push({
      chapterOrder,
      topicIndex,
      completedAt: new Date()
    });
  }
  
  this.progress.currentChapter = chapterOrder;
  this.progress.currentTopic = topicIndex;
  this.progress.lastAccessedAt = new Date();
  
  return this.save();
};

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment; 