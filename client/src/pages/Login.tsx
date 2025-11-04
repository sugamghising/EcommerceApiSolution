import React from "react";
import LoginForm from "../components/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="page-container">
      <div className="card p-8 max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
