import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-2">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
      >
        Go back to Home
      </Link>
    </div>
  );
};
export default NotFoundPage;
