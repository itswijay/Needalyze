# Email Verification & Approval Workflow Guide

## Overview

Your authentication system now includes **TWO-STEP VERIFICATION**:

1. Email Verification (validates email is real)
2. Admin Approval (validates user identity)

## Complete User Journey

### 1. Registration Flow

```
User Fills Registration Form
  ↓
Submit → Creates account in Supabase
  ↓
Email Verification Link Sent
  ↓
Success Message: "Please check your email to verify your account"
  ↓
Redirect to Login (after 3 seconds)
```

### 2. Email Verification

```
User Checks Email Inbox
  ↓
Clicks "Confirm Email" Link
  ↓
Email Confirmed
  ↓
Account Status: Still "pending" (waiting for admin)
```

### 3. First Login Attempt (Before Admin Approval)

```
User Tries to Login
  ↓
Email Confirmed? → Check Status
  ↓
Status = "pending"
  ↓
Login Blocked
  ↓
Message: "Your account is pending approval. Please wait for admin approval."
```

### 4. Admin Approval (Future Feature)

```
Admin Reviews New Users
  ↓
Admin Approves User
  ↓
Status Changed: "pending" → "approved"
  ↓
User Can Now Login
```

### 5. Successful Login (After Both Verifications)

```
User Tries to Login
  ↓
Email Confirmed?
  ↓
Status = "approved"?
  ↓
Login Successful
  ↓
Redirect to Dashboard
```

## Login Validation Checks (in order)

### Check 1: Credentials

```javascript
// Supabase validates email/password
if (invalid credentials) {
  return "Invalid login credentials"
}
```

### Check 2: Email Confirmation

```javascript
if (!email_confirmed_at) {
  return 'Please verify your email address before logging in. Check your inbox for the confirmation link.'
}
```

### Check 3: Profile Status

```javascript
if (status !== 'approved') {
  return 'Your account is pending approval. Please wait for admin approval.'
}
```

### Check 4: Success

```javascript
// All checks passed
// User can access dashboard
```

## Supabase Dashboard Configuration

### Enable Email Confirmations:

1. Go to Supabase Dashboard: `https://supabase.com/dashboard`
2. Select Your Project
3. Navigate: **Authentication → Settings**
4. Scroll to **"Email Auth"** section
5. Ensure **"Enable email confirmations"** is **CHECKED**
6. Click **Save**

### Configure Email Templates (Optional):

1. Navigate: **Authentication → Email Templates**
2. Customize **"Confirm signup"** template
3. Update:
   - Subject line
   - Email body
   - Button text
   - Redirect URL after confirmation

### Recommended Email Template:

```
Subject: Verify your Needalyze account

Hi {{ .Email }},

Thanks for signing up! Please confirm your email address by clicking the button below:

[Confirm Email]

After confirming your email, your account will be reviewed by our admin team. You'll be notified once your account is approved.

If you didn't create an account, you can safely ignore this email.

Thanks,
The Needalyze Team
```

## User Status States

| Status      | Email Confirmed | Can Login | Description                                |
| ----------- | --------------- | --------- | ------------------------------------------ |
| `pending`   | ❌              | ❌        | Just registered, email not verified        |
| `pending`   | ✅              | ❌        | Email verified, waiting for admin approval |
| `approved`  | ✅              | ✅        | Fully approved, can access system          |
| `rejected`  | ✅              | ❌        | Admin rejected (future feature)            |
| `suspended` | ✅              | ❌        | Account suspended (future feature)         |

## Error Messages

### Registration

- Success: "Please check your email to verify your account..."
- Email already exists: "User already registered"
- Weak password: "Password should be at least 6 characters"

### Login

- Invalid credentials: "Invalid login credentials"
- Email not verified: "Please verify your email address before logging in..."
- Pending approval: "Your account is pending approval. Please wait for admin approval."
- Profile error: "Unable to verify account status. Please contact support."

## Testing Checklist

### Registration Test:

1. Register with valid email
2. Receive confirmation email
3. Click confirmation link
4. Email confirmed in Supabase (check auth.users table)
5. User profile created with status='pending'

### Email Verification Test:

1. Try login before email confirmation → Should fail
2. Confirm email via link
3. Check `email_confirmed_at` in auth.users table

### Admin Approval Test:

1. Try login after email confirmation → Should fail (pending)
2. Manually change status to 'approved' in database
3. Try login again → Should succeed

### Full Flow Test:

1. Register → Email sent
2. Try login → Blocked (email not confirmed)
3. Confirm email
4. Try login → Blocked (pending approval)
5. Admin approves (change status to 'approved')
6. Try login → Success! Dashboard loads

## Benefits of This Approach

### Email Validation

- Ensures users provide real, accessible email addresses
- Prevents typos in email addresses
- Confirms user owns the email

### Admin Approval

- Additional security layer
- Manual verification of user identity
- Control over who accesses the system
- Prevents spam/fake registrations

### User Experience

- Clear error messages at each step
- Users know exactly what to expect
- Transparent approval process

## Database Queries for Admins

### View Pending Users (Email Verified, Waiting Approval):

```sql
SELECT
  up.first_name,
  up.last_name,
  up.phone_number,
  up.position,
  up.branch,
  au.email,
  au.email_confirmed_at,
  up.status
FROM user_profile up
JOIN auth.users au ON up.user_id = au.id
WHERE up.status = 'pending'
  AND au.email_confirmed_at IS NOT NULL
ORDER BY au.created_at DESC;
```

### Approve User:

```sql
UPDATE user_profile
SET status = 'approved'
WHERE user_id = 'USER_UUID_HERE';
```

### View All Users by Status:

```sql
SELECT
  up.status,
  COUNT(*) as count
FROM user_profile up
GROUP BY up.status;
```

## Next Steps

1. **Keep email confirmation enabled** in Supabase
2. **Test registration flow** - verify email is sent
3. **Test login validations** - try before/after email confirmation
4. **Build admin approval interface** (future task)
5. **Add email resend functionality** (optional)

## Troubleshooting

### "No confirmation email received"

- Check spam/junk folder
- Verify Supabase email settings
- Check email templates are configured
- Verify SMTP settings (if using custom SMTP)

### "Email confirmation link not working"

- Check redirect URL in Supabase settings
- Verify site URL is correct
- Check if link expired (default: 24 hours)

### "Can't login after email confirmation"

- Verify `email_confirmed_at` is set in database
- Check `status` is 'approved' in user_profile
- Check browser console for errors

## Summary

Your authentication now has **robust validation**:

- Valid email addresses only (via email confirmation)
- Admin control over user access (via approval workflow)
- Clear user feedback at each step
- Secure and professional authentication flow

This is a **production-ready authentication system**! 🎉
