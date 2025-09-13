<?php

namespace Modules\User\Http\Controllers;
use App\Http\Controllers\Controller;
use Modules\User\Http\Resources\UserResource;
use Modules\User\Http\Resources\UserProfileResource;
use Modules\User\Models\User;
use Modules\User\Http\Requests\UserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{

    public function profile(): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => new UserProfileResource(Auth::user())
        ]);
        \Log::info('Auth user:', ['id' => auth()->id()]);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data' => new UserResource($user)
        ]);
    }

    public function updateProfile(UserRequest $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();
            $data = $request->validated();

            if ($request->hasFile('profile_picture')) {
                $this->handleProfilePicture($user, $data);
            }

            $user->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Profile updated successfully',
                'data' => new UserProfileResource($user)
            ]);

        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * @param User $user
     * @param array $data
     */
    


    private function handleProfilePicture(User $user, array &$data): void
    {
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $data['profile_picture'] = $data['profile_picture']->store('profile-pictures', 'public');
    }

    private function errorResponse(string $message, int $code = Response::HTTP_INTERNAL_SERVER_ERROR): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'error' => $message
        ], $code);
    }
}