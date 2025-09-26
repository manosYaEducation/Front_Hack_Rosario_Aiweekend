// Session management and authentication check
(function() {
    'use strict';

    function isUserLoggedIn() {
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true' || 
                            sessionStorage.getItem('userLoggedIn') === 'true';
        const username = localStorage.getItem('username') || sessionStorage.getItem('username');
        const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
        
        return userLoggedIn && (username || userEmail);
    }

    function redirectToLogin() {
        localStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('userLoggedIn');
        localStorage.removeItem('username');
        sessionStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        sessionStorage.removeItem('userName');
        localStorage.removeItem('userId');
        sessionStorage.removeItem('userId');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('roles');
        sessionStorage.removeItem('roles');
        localStorage.removeItem('userProjectMemberships'); // Clear memberships on logout
        
        window.location.href = 'login';
    }

    function checkSession() {
        const currentPath = window.location.pathname;
        const skipPages = ['/login', '/register', '/recover-password', '/index', '/', '/project-list', '/project-detail'];
        
        if (skipPages.some(page => currentPath.includes(page))) {
            return;
        }

        if (!isUserLoggedIn()) {
            console.log('User not logged in, redirecting to login');
            redirectToLogin();
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        checkSession();
    });

    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            checkSession();
        }
    });

    window.isAuthenticated = function() {
        return isUserLoggedIn();
    };

    window.getUserData = function() {
        return {
            username: localStorage.getItem('username') || sessionStorage.getItem('username'),
            userEmail: localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail'),
            userName: localStorage.getItem('userName') || sessionStorage.getItem('userName'),
            userId: localStorage.getItem('userId') || sessionStorage.getItem('userId'),
            token: localStorage.getItem('token') || sessionStorage.getItem('token')
        };
    };

    window.isProjectMember = function(projectId) {
        const userData = window.getUserData();
        const userEmail = userData.userEmail;
        if (!userEmail) return false;
        
        const memberships = JSON.parse(localStorage.getItem('userProjectMemberships') || '[]');
        return memberships.some(m => m.projectId === projectId && m.userEmail === userEmail);
    };

    window.updateProjectMembership = function(projectId, isMember) {
        const userData = window.getUserData();
        const userEmail = userData.userEmail;
        const userName = userData.userName || userData.username;
        
        if (!userEmail) return;
        
        let memberships = JSON.parse(localStorage.getItem('userProjectMemberships') || '[]');
        
        if (isMember) {
            const existingIndex = memberships.findIndex(m => m.projectId === projectId && m.userEmail === userEmail);
            if (existingIndex === -1) {
                memberships.push({
                    projectId: projectId,
                    userEmail: userEmail,
                    userName: userName,
                    role: 'member',
                    joinedAt: new Date().toISOString()
                });
            }
        } else {
            memberships = memberships.filter(m => !(m.projectId === projectId && m.userEmail === userEmail));
        }
        
        localStorage.setItem('userProjectMemberships', JSON.stringify(memberships));
    };

    window.logout = function() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'login';
    };

})();
