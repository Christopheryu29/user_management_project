import React, { useState, useEffect } from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
  DialogCloseTrigger,
  DialogBackdrop,
  DialogPositioner,
  Button,
  Field,
  Input,
  NativeSelectRoot,
  NativeSelectField,
  VStack,
  HStack,
  createToaster,
} from '@chakra-ui/react';
import { User, UserFormData } from '../types/User';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => void;
  user?: User | null;
  title: string;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, user, title }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    gender: 'Male',
    birthday: '',
    occupation: 'Student',
    phone: '',
    image: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toaster = createToaster({
    placement: "top",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        gender: user.gender,
        birthday: user.birthday.split('T')[0],
        occupation: user.occupation,
        phone: user.phone,
        image: null
      });
    } else {
      setFormData({
        name: '',
        gender: 'Male',
        birthday: '',
        occupation: 'Student',
        phone: '',
        image: null
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must contain at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        toaster.create({
          title: user ? 'User updated successfully' : 'User created successfully',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toaster.create({
          title: 'Error',
          description: user ? 'Failed to update user' : 'Failed to create user',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={(e: { open: boolean }) => !e.open && onClose()} 
      size="md"
      placement="center"
      closeOnInteractOutside={true}
    >
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent mx={4} bg="white" shadow="xl" borderRadius="lg">
          <DialogHeader>
            <DialogTitle fontSize="xl" fontWeight="bold">
              {title}
            </DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <DialogBody>
              <VStack gap={4}>
                <Field.Root required invalid={!!errors.name}>
                  <Field.Label>Name</Field.Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                  />
                  {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Gender</Field.Label>
                  <NativeSelectRoot>
                    <NativeSelectField
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field.Root>

                <Field.Root required invalid={!!errors.birthday}>
                  <Field.Label>Birthday</Field.Label>
                  <Input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                  />
                  {errors.birthday && <Field.ErrorText>{errors.birthday}</Field.ErrorText>}
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Occupation</Field.Label>
                  <NativeSelectRoot>
                    <NativeSelectField
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                    >
                      <option value="Student">Student</option>
                      <option value="Engineer">Engineer</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Unemployed">Unemployed</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field.Root>

                <Field.Root required invalid={!!errors.phone}>
                  <Field.Label>Phone</Field.Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <Field.ErrorText>{errors.phone}</Field.ErrorText>}
                </Field.Root>

                <Field.Root>
                  <Field.Label>Profile Image</Field.Label>
                  <Input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    p={1}
                  />
                </Field.Root>
              </VStack>
            </DialogBody>

            <DialogFooter>
              <HStack gap={3}>
                <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorPalette="blue"
                  loading={isSubmitting}
                  loadingText={user ? 'Updating...' : 'Creating...'}
                >
                  {user ? 'Update' : 'Create'} User
                </Button>
              </HStack>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UserModal;