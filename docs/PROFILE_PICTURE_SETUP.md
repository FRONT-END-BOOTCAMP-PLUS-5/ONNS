# Profile Picture Upload Setup (Clean Architecture)

This document explains how to set up Supabase storage for profile picture uploads using clean architecture principles.

## Prerequisites

1. Supabase project with storage enabled
2. Proper storage policies configured

## Storage Bucket Setup

### 1. Create Storage Bucket

In your Supabase dashboard, create a new storage bucket called `profile-img`:

1. Go to Storage in your Supabase dashboard
2. Click "Create a new bucket"
3. Name: `profile-img`
4. Public bucket: ✅ (checked)
5. File size limit: 5MB
6. Allowed MIME types: `image/*`

### 2. Storage Policies

**Option 1: Simple Policies (Recommended for testing)**

Create these simple policies for the `profile-img` bucket:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-img' AND
  auth.uid() IS NOT NULL
);

-- Allow public read access
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-img');

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-img' AND
  auth.uid() IS NOT NULL
);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-img' AND
  auth.uid() IS NOT NULL
);
```

**Option 2: More Restrictive Policies (For production)**

If you want more security, you can use these policies that check the filename:

```sql
-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-img' AND
  auth.uid() IS NOT NULL AND
  name LIKE 'profile-pictures/profile-' || auth.uid()::text || '-%'
);

-- Allow public read access to profile pictures
CREATE POLICY "Public read access to profile pictures" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-img');

-- Allow users to update their own profile pictures
CREATE POLICY "Users can update their own profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-img' AND
  auth.uid() IS NOT NULL AND
  name LIKE 'profile-pictures/profile-' || auth.uid()::text || '-%'
);

-- Allow users to delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-img' AND
  auth.uid() IS NOT NULL AND
  name LIKE 'profile-pictures/profile-' || auth.uid()::text || '-%'
);
```

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Clean Architecture Implementation

The profile picture upload feature follows clean architecture principles:

### Domain Layer
- **Repository Interface**: `IUserRepository` defines the contract for profile image operations
- **Entities**: `User` entity represents the domain model

### Application Layer
- **Use Cases**: 
  - `UploadProfileImageUseCase` - Handles profile image upload business logic
  - `DeleteProfileImageUseCase` - Handles profile image deletion business logic

### Infrastructure Layer
- **Repository Implementation**: `SbUserRepository` implements the storage operations using Supabase

### Presentation Layer
- **API Routes**: `app/api/users/me/profile-picture/route.ts` - HTTP endpoints using use cases
- **React Components**: UI components that interact with the API

## File Structure

### Clean Architecture Implementation
- `(backend)/my/domain/repositories/IUserRepository.ts` - Repository interface with profile image methods
- `(backend)/my/infrastructure/repositories/SbUserRepository.ts` - Supabase implementation of profile image operations
- `(backend)/my/application/usecases/UploadProfileImageUseCase.ts` - Use case for profile image uploads
- `(backend)/my/application/usecases/DeleteProfileImageUseCase.ts` - Use case for profile image deletion

### Frontend Components
- `hooks/useProfilePictureUpload.ts` - React hook for upload functionality
- `app/api/users/me/profile-picture/route.ts` - API endpoints using clean architecture
- `app/(anon)/my/components/ProfileEditHeader.tsx` - UI component with upload functionality

## Usage

The profile picture upload functionality is now integrated into the profile editing components:

1. **Upload**: Click the edit icon on the profile picture to open a file dialog
2. **Delete**: Use the "Remove profile picture" button to delete the current profile picture
3. **Validation**: Files are validated for type (image only) and size (max 5MB)

## Error Handling

The system handles various error scenarios:
- Invalid file types
- File size limits
- Network errors
- Storage permission errors

Error messages are displayed to the user in the UI.

## Security Considerations

1. **File Type Validation**: Only image files are accepted
2. **File Size Limits**: Maximum 5MB per file
3. **User Isolation**: Users can only upload/delete their own profile pictures
4. **Unique Filenames**: Files are named with user ID and timestamp to prevent conflicts
5. **Clean Architecture**: Business logic is separated from infrastructure concerns

## Benefits of Clean Architecture

1. **Testability**: Use cases can be easily unit tested
2. **Maintainability**: Clear separation of concerns
3. **Flexibility**: Easy to swap storage implementations
4. **Scalability**: Business logic is independent of external dependencies

## Troubleshooting

### Common Issues

#### 1. "new row violates row-level security policy" Error
**Cause**: RLS policies are too restrictive or not properly configured.

**Solution**: 
1. Use the simple policies (Option 1) first for testing
2. Make sure the bucket name matches exactly: `profile-img`
3. Ensure RLS is enabled on the bucket
4. Check that the user is properly authenticated

#### 2. "Unauthorized" Error
**Cause**: User is not authenticated or token is invalid.

**Solution**:
1. Check that the user is logged in
2. Verify the JWT token is valid
3. Ensure the API route is properly protected

#### 3. File Upload Fails
**Cause**: File validation or size issues.

**Solution**:
1. Check file type (must be image)
2. Verify file size (max 5MB)
3. Ensure the file input is properly configured

#### 4. Profile Picture Not Updating
**Cause**: Database update failed or URL not saved.

**Solution**:
1. Check the database connection
2. Verify the user table has a `profile_img` column
3. Check the API response for errors

### Testing the Setup

1. **Test Upload**: Try uploading a small image file (< 1MB)
2. **Test Delete**: Try deleting an existing profile picture
3. **Check Storage**: Verify files appear in the Supabase storage dashboard
4. **Check Database**: Verify the `profile_img` field is updated in the user table 