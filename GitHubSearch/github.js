class GitHub {
    constructor() {
        this.client_id = '1bcb1d4881caa9deee08';
        this.client_secret = 'dab506bcf4c5ace8f98403ec7a09fecb29eb3b02';
        this.repos_count = 5;
        this.repos_sort = 'created: asc';
    }

    async getUser(user) {
     
        const [ profileResponse, repoResponse ] = await Promise.all([
            fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`).then(response => response.json()),
            fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`).then(response => response.json())
        ]);
 
        return {
            profile: profileResponse,
            repos: repoResponse
        }
    }
}