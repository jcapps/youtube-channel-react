import React from 'react';
import PropTypes from 'prop-types';

class VideoPlayerStats extends React.Component {
    componentDidMount() {
        this.setLikeBarWidths();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.video.id != nextProps.video.id) {
            this.setLikeBarWidths();
        }
    }

    setLikeBarWidths() {
        setTimeout(() => {
            const stats = this.props.video.statistics;
            const likeBar = document.getElementById('like-bar');
            const dislikeBar = document.getElementById('dislike-bar');

            if (likeBar && dislikeBar) {
                likeBar.removeAttribute('class');
                dislikeBar.removeAttribute('class');
                likeBar.removeAttribute('style');
                dislikeBar.removeAttribute('style');

                setTimeout(() => {
                    const totalCount = parseInt(stats.likeCount) + parseInt(stats.dislikeCount);
                    const likePercentage = 100 * (stats.likeCount / totalCount);
                    const dislikePercentage = 100 - likePercentage;

                    likeBar.setAttribute('style', 'width: ' + likePercentage + '%;');
                    dislikeBar.setAttribute('style', 'width: ' + dislikePercentage + '%;');
                    likeBar.setAttribute('class', 'displayed');
                    dislikeBar.setAttribute('class', 'displayed');
                }, 10);
            }
        }, 10);
    }

    formatNumberString(number) {
        return parseInt(number).toLocaleString();
    }

    renderEmptyBar() {
        const stats = this.props.video.statistics;
        if (stats.likeCount == '0' && stats.dislikeCount == '0') {
            return <div id="empty-bar" />;
        }
    }

    render() {
        const stats = this.props.video.statistics;
        if (stats && stats.likeCount) {
            return (
                <div className="video-stats">
                    <div id="like-bar-container">
                        <div id="like-bar" />
                        <div id="dislike-bar" />
                        {this.renderEmptyBar()}
                    </div>
                    <div id="stats">
                        <div id="likes-dislikes">
                            <span>Likes: </span>
                            <span id="likes">{this.formatNumberString(stats.likeCount)}</span>
                            <span> - </span>
                            <span id="dislikes">{this.formatNumberString(stats.dislikeCount)}</span>
                        </div>
                        <div id="views">
                            <span>Views: </span>
                            <span>{this.formatNumberString(stats.viewCount)}</span>
                        </div>
                        <div id="end-stats" />
                    </div>
                </div>
            );
        } else {
            return <div>(Unable to load video statistics)</div>;
        }
    }
}

VideoPlayerStats.propTypes = {
    video: PropTypes.object.isRequired
};

export default VideoPlayerStats;