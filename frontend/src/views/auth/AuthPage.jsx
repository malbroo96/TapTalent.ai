import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from "../../controllers/authController";

const AuthPage = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl">
      <h1 className="mb-3 text-3xl font-semibold">Welcome Back</h1>
      <p className="mb-8 text-sm text-slate-200/90">
        Sign in with Google to access your personalized weather dashboard.
      </p>
      <button
        className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
        onClick={() => dispatch(loginWithGoogle())}
      >
        Sign in with Google
      </button>
      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
};

export default AuthPage;
