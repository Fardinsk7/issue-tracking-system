export default class Requests {
  private baseUrl: string;

  constructor(baseUrl = process.env.NEXT_PUBLIC_SERVER_URL) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string, options: Record<string, any> = {}) {
    const url = this.baseUrl + endpoint;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async post(
    endpoint: string,
    data: Record<string, any>,
    options: Record<string, any> = {}
  ) {
    const url = this.baseUrl + endpoint;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    return await response.json();
  }
}
