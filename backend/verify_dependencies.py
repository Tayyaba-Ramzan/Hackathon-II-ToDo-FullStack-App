#!/usr/bin/env python3
"""
Dependency Verification Script
Verifies all required packages are installed correctly before deployment.
"""

import sys

def check_imports():
    """Check if all critical dependencies can be imported."""

    dependencies = {
        'fastapi': 'FastAPI',
        'uvicorn': 'Uvicorn',
        'sqlmodel': 'SQLModel',
        'psycopg2': 'PostgreSQL Driver',
        'pydantic': 'Pydantic',
        'email_validator': 'Email Validator',
        'jwt': 'PyJWT',
        'passlib': 'Passlib',
        'jose': 'Python-JOSE',
        'dotenv': 'Python-Dotenv',
    }

    print("Verifying dependencies...\n")

    failed = []
    passed = []

    for module, name in dependencies.items():
        try:
            __import__(module)
            passed.append(f"[OK] {name} ({module})")
        except ImportError as e:
            failed.append(f"[FAIL] {name} ({module}): {str(e)}")

    # Print results
    for item in passed:
        print(item)

    if failed:
        print("\nFailed imports:")
        for item in failed:
            print(item)
        print("\nRun: pip install -r requirements.txt")
        return False

    print("\nAll dependencies verified successfully!")
    return True


def check_email_validator():
    """Specifically test email validation functionality."""
    print("\nTesting email validation...")

    try:
        from pydantic import BaseModel, EmailStr

        class TestModel(BaseModel):
            email: EmailStr

        # Test valid email
        test = TestModel(email="test@example.com")
        print(f"[OK] Email validation working: {test.email}")

        # Test invalid email
        try:
            TestModel(email="invalid-email")
            print("[FAIL] Email validation not working properly")
            return False
        except Exception:
            print("[OK] Email validation rejecting invalid emails")

        return True

    except Exception as e:
        print(f"[FAIL] Email validation failed: {e}")
        print("Run: pip install email-validator")
        return False


def check_psycopg2():
    """Test psycopg2 import."""
    print("\nTesting PostgreSQL driver...")

    try:
        import psycopg2
        print(f"[OK] psycopg2 version: {psycopg2.__version__}")
        return True
    except ImportError as e:
        print(f"[FAIL] psycopg2 import failed: {e}")
        print("Run: pip install psycopg2-binary")
        return False


def main():
    """Run all verification checks."""
    print("=" * 60)
    print("FastAPI Deployment Dependency Verification")
    print("=" * 60)

    checks = [
        check_imports(),
        check_email_validator(),
        check_psycopg2(),
    ]

    print("\n" + "=" * 60)

    if all(checks):
        print("[SUCCESS] All checks passed! Ready for deployment.")
        print("=" * 60)
        return 0
    else:
        print("[ERROR] Some checks failed. Fix issues before deploying.")
        print("=" * 60)
        return 1


if __name__ == "__main__":
    sys.exit(main())
