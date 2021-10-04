const fetch = require('node-fetch');
const { stringify } = require('querystring');

class Handlers {
    constructor (typeform_api_url, default_form_id) {
        this.TYPEFORM_API_URL = typeform_api_url;
        this.DEFAULT_FORM_ID = default_form_id;

        this.indexHandler = this.indexHandler.bind(this);
        this.displayResultsHandler = this.displayResultsHandler.bind(this);
    }

    indexHandler(req, res) {
        if (!req.isAuthenticated()) {
            return res.end(`
            <body>
                <h3>Hello stranger!</h3>
                <p>You're not authenticated, you need to <a href="/login">authenticate via Typeform</a>.
            </body>
            `)
        }

        if (this.DEFAULT_FORM_ID) {
            return res.redirect(`/results/${this.DEFAULT_FORM_ID}`);
        }

        let data = JSON.stringify(req.user);
        return res.end(`
        <body>
            <h3>Hello, %username%!</h3>
            <p>Here's your token:</p><p style="color: blue;">${data}</p>
            <p>Maybe you want to <a href="/logout">log out</a>?</p>
        </body>
        `);
    }

    displayResultsHandler(req, res) {
        fetch(`${this.TYPEFORM_API_URL}/forms/${req.params.id}/responses`, {
            headers: {
                Authorization: `Bearer ${req.user.access_token}`,
            }
        })
        .then(res => res.json())
        .then(d => {
            const results = []
            d.items.forEach(item => {
                if (item.answers) {
                    //console.log(item.answers)
                }
            })

            const ans = d.items.map (item => item.answers)
            //console.log(ans)
            //if ans.type = 'text' --> result.name
            //if ans.type = 'email' --> result.email
            for (const item of ans){
                const data = {
                    name : item[0].text,
                    email : item[1].email
                }
                results.push(data)
            }
            console.log(results)
            let data = JSON.stringify(results);
            return res.end(`
            <body>
                <p>${data}</p>
            </body>
                `)
        })
        .catch(e => {
            console.log(e);
            return res.end(e.toString());
        })
    }
}

module.exports = Handlers;