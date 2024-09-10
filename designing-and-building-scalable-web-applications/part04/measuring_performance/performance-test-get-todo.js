import http from 'k6/http';

export const options = {
    duration: "10s",
    vus: 10,
    thresholds: {
        http_req_duration: [
            {
                threshold: "p(50)<500", abortOnFail: true
            },
            {
                threshold: "p(99)<1500", abortOnFail: true
            },
        ]
    }
};

export default function () {
    http.get("http://localhost:7777/todos");
}