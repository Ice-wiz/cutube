# Cutube Video app

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/video-platform.git
    ```
2. Navigate to the project directory:
    ```sh
    cd video-platform
    ```
3. Set up environment variables:
    - Copy the sample environment file and update it with your credentials:
        ```sh
        cp .env.sample .env
        ```
4. Install dependencies for both frontend and backend:
    ```sh
    cd frontend
    npm install
    cd ../backend
    npm install
    ```
5. Start the development server:
    ```sh
    npm run dev
    ```

## About the Platform

### User Authentication
- Users can authenticate using their email get a password to their registered email and can login using that 
- Mandrill API is used for email authentication, ensuring a secure and seamless login experience.

### Video Uploads
- Authenticated users can upload videos.
- Each video requires a title, description, and thumbnail.
- Users can also upload profile pictures.
- Amazon S3 is used to get signed URLs for securely uploading media.

### UI Enhancements
- The platform utilizes lazy loading to enhance the user interface, ensuring faster load times and a smoother user experience.

### Video Listings
- Users can navigate to the listing page to view all uploaded videos.
- The listing page features all users and their respective videos, making it easy to discover new content.
- Users can view anyone's profile from the listing page, allowing them to explore more videos and information about other users.

Enjoy using the Video Platform!
