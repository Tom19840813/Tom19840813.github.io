/**
 * Gemini Interactive Podcast Component
 * Handles Daily.co WebRTC session and Audio Visualization
 */

class PodcastComponent {
    constructor() {
        this.callFrame = null;
        this.roomUrl = null;
        this.token = null;
        this.isJoining = false;
        this.isConnected = false;

        this.init();
    }

    init() {
        this.container = document.getElementById('podcast-app');
        if (!this.container) return;

        this.renderInitialState();
        this.attachListeners();
    }

    renderInitialState() {
        this.container.innerHTML = `
            <div class="podcast-container">
                <div class="podcast-content">
                    <h2 class="vibe-title">Interactive AI Podcast</h2>
                    <p class="vibe-subtitle">Jump into a live voice-to-voice conversation with my AI assistant. Discuss my projects, tech stacks, or just have a chat.</p>
                    
                    <div class="visualizer-box" id="visualizer">
                        ${Array(15).fill('<div class="bar"></div>').join('')}
                    </div>

                    <div id="controls">
                        <button id="join-btn" class="podcast-btn btn-primary">Join Conversation</button>
                    </div>

                    <div class="status-indicator">
                        <div id="status-dot" class="dot"></div>
                        <span id="status-text">Ready to connect</span>
                    </div>
                </div>
            </div>
        `;
    }

    attachListeners() {
        const joinBtn = document.getElementById('join-btn');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => this.handleJoinClick());
        }
    }

    async handleJoinClick() {
        if (this.isJoining || this.isConnected) return;

        this.updateStatus('Initializing session...', 'active');
        this.isJoining = true;
        const joinBtn = document.getElementById('join-btn');
        joinBtn.disabled = true;
        joinBtn.innerText = 'Connecting...';

        try {
            // 1. Get room details from Netlify function
            const response = await fetch('/.netlify/functions/start-podcast', {
                method: 'POST'
            });

            if (!response.ok) throw new Error('Failed to get session details');

            const data = await response.json();
            this.roomUrl = data.roomUrl;
            this.token = data.token;

            // 2. Initialize Daily Call
            this.callFrame = window.DailyIframe.createCallObject({
                audioSource: true,
                videoSource: false, // Voice only
            });

            // 3. Set up event handlers
            this.callFrame.on('joined-meeting', (evt) => this.handleJoined(evt));
            this.callFrame.on('left-meeting', (evt) => this.handleLeft(evt));
            this.callFrame.on('error', (err) => this.handleError(err));
            this.callFrame.on('participant-updated', (evt) => this.handleParticipantUpdated(evt));

            // 4. Join the room
            await this.callFrame.join({ url: this.roomUrl, token: this.token });

        } catch (error) {
            console.error('Join error:', error);
            this.handleError(error);
        } finally {
            this.isJoining = false;
        }
    }

    handleJoined() {
        this.isConnected = true;
        this.updateStatus('Live Conversation Active', 'active');

        const controls = document.getElementById('controls');
        controls.innerHTML = `<button id="leave-btn" class="podcast-btn btn-danger">End Conversation</button>`;

        document.getElementById('leave-btn').addEventListener('click', () => this.handleLeave());
        this.startVisualizer();
    }

    handleLeave() {
        if (this.callFrame) {
            this.callFrame.leave();
        }
    }

    handleLeft() {
        this.isConnected = false;
        this.stopVisualizer();
        this.renderInitialState();
        this.attachListeners();
        this.updateStatus('Conversation Ended', '');
    }

    handleError(err) {
        this.updateStatus('Connection Error. Try again.', '');
        const joinBtn = document.getElementById('join-btn');
        if (joinBtn) {
            joinBtn.disabled = false;
            joinBtn.innerText = 'Join Conversation';
        }
        alert('Could not start the interactive session. Please check your console or ensure API keys are set.');
    }

    handleParticipantUpdated(evt) {
        // Here we could detect if the AI (Pipecat bot) has joined or is speaking
        // For now, we'll focus on the user's audio for visualization
    }

    updateStatus(message, className) {
        const dot = document.getElementById('status-dot');
        const text = document.getElementById('status-text');
        if (text) text.innerText = message;
        if (dot) {
            dot.className = 'dot ' + className;
        }
    }

    startVisualizer() {
        this.visualizerActive = true;
        const bars = document.querySelectorAll('.bar');

        const animate = () => {
            if (!this.visualizerActive) return;
            bars.forEach(bar => {
                const height = Math.random() * 80 + 20;
                bar.style.height = `${height}px`;
            });
            setTimeout(() => requestAnimationFrame(animate), 100);
        };

        animate();
    }

    stopVisualizer() {
        this.visualizerActive = false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.podcastApp = new PodcastComponent();
});
