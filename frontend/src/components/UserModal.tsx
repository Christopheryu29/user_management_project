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
  Text,
  Box,
  Image,
  Card,
  Flex,
  Badge,
  Separator,
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      
      // Set image preview if user has an image
      if (user.image) {
        if (user.image.startsWith('http')) {
          setImagePreview(user.image);
        } else {
          setImagePreview(`http://localhost:5001/uploads/${user.image}`);
        }
      }
    } else {
      setFormData({
        name: '',
        gender: 'Male',
        birthday: '',
        occupation: 'Student',
        phone: '',
        image: null
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Birthday validation
    if (!formData.birthday) {
      newErrors.birthday = 'Birthday is required';
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13 || age > 120) {
        newErrors.birthday = 'Age must be between 13 and 120 years';
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    } else if (formData.phone.replace(/\D/g, '').length < 10 || formData.phone.replace(/\D/g, '').length > 15) {
      newErrors.phone = 'Phone must be between 10 and 15 digits';
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
        // Don't show toast here - let parent component handle it
      } catch (error) {
        // Error is handled by parent component
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

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getOccupationIcon = (occupation: string) => {
    const icons = {
      Student: "🎓",
      Engineer: "👷",
      Teacher: "👨‍🏫", 
      Unemployed: "🔍",
    };
    return icons[occupation as keyof typeof icons] || "💼";
  };

  const getGenderIcon = (gender: string) => {
    const icons = {
      Male: "👨",
      Female: "👩",
      Other: "🧑",
    };
    return icons[gender as keyof typeof icons] || "👤";
  };

  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={(e: { open: boolean }) => !e.open && onClose()} 
      size="lg"
      placement="center"
      closeOnInteractOutside={false}
    >
      <DialogBackdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <DialogPositioner>
        <DialogContent 
          mx={4} 
          bg="white" 
          shadow="2xl" 
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="gray.200"
          maxH="90vh"
          overflowY="auto"
        >
          {/* Modern Header */}
          <Box
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            p={6}
            borderTopRadius="2xl"
          >
            <DialogHeader p={0}>
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Text fontSize="2xl">
                    {user ? "✏️" : "👤"}
                  </Text>
                  <DialogTitle fontSize="xl" fontWeight="bold">
                    {title}
                  </DialogTitle>
                </HStack>
                <DialogCloseTrigger 
                  color="white" 
                  _hover={{ bg: "whiteAlpha.200" }}
                  borderRadius="lg"
                />
              </HStack>
            </DialogHeader>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <DialogBody p={8}>
              <VStack gap={8} align="stretch">
                {/* Image Preview Section */}
                <Card.Root bg="gray.50" p={6} borderRadius="xl">
                  <VStack gap={4}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                      📷 Profile Picture
                    </Text>
                    
                    <Box
                      w="80px"
                      h="80px"
                      borderRadius="full"
                      overflow="hidden"
                      borderWidth="4px"
                      borderColor="white"
                      shadow="lg"
                      bg="gray.100"
                    >
                      <Image
                        src={imagePreview || "/default-person.png"}
                        alt={formData.name || "User"}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-person.png";
                        }}
                      />
                    </Box>
                    
                    <Field.Root>
                      <Input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        p={2}
                        borderRadius="lg"
                        bg="white"
                        borderWidth="2px"
                        borderStyle="dashed"
                        borderColor="gray.300"
                        _hover={{ borderColor: "blue.400" }}
                        _focus={{ borderColor: "blue.500" }}
                      />
                      <Field.HelperText textAlign="center" fontSize="sm">
                        Upload JPG, PNG, or GIF (max 5MB)
                      </Field.HelperText>
                    </Field.Root>
                  </VStack>
                </Card.Root>

                <Separator />

                {/* Form Fields */}
                <VStack gap={6} align="stretch">
                  {/* Name Field */}
                  <Field.Root required invalid={!!errors.name}>
                    <Field.Label fontSize="md" fontWeight="semibold" color="gray.700">
                      <HStack gap={2}>
                        <Text>✨</Text>
                        <Text>Full Name</Text>
                      </HStack>
                    </Field.Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="👤 Enter full name"
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      _focus={{ bg: "white", borderColor: "blue.400" }}
                    />
                    {errors.name && <Field.ErrorText color="red.500">{errors.name}</Field.ErrorText>}
                  </Field.Root>

                  {/* Gender and Birthday Row */}
                  <HStack gap={6} align="start">
                    <Field.Root flex={1} required>
                      <Field.Label fontSize="md" fontWeight="semibold" color="gray.700">
                        <HStack gap={2}>
                          <Text>{getGenderIcon(formData.gender)}</Text>
                          <Text>Gender</Text>
                        </HStack>
                      </Field.Label>
                      <NativeSelectRoot size="lg">
                        <NativeSelectField
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          borderRadius="xl"
                          bg="gray.50"
                          _focus={{ bg: "white", borderColor: "blue.400" }}
                        >
                          <option value="Male">👨 Male</option>
                          <option value="Female">👩 Female</option>
                          <option value="Other">🧑 Other</option>
                        </NativeSelectField>
                      </NativeSelectRoot>
                    </Field.Root>

                    <Field.Root flex={1} required invalid={!!errors.birthday}>
                      <Field.Label fontSize="md" fontWeight="semibold" color="gray.700">
                        <HStack gap={2}>
                          <Text>🎂</Text>
                          <Text>Birthday</Text>
                        </HStack>
                      </Field.Label>
                      <Input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        size="lg"
                        borderRadius="xl"
                        bg="gray.50"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      />
                      {errors.birthday && <Field.ErrorText color="red.500">{errors.birthday}</Field.ErrorText>}
                    </Field.Root>
                  </HStack>

                  {/* Occupation Field */}
                  <Field.Root required>
                    <Field.Label fontSize="md" fontWeight="semibold" color="gray.700">
                      <HStack gap={2}>
                        <Text>{getOccupationIcon(formData.occupation)}</Text>
                        <Text>Occupation</Text>
                      </HStack>
                    </Field.Label>
                    <NativeSelectRoot size="lg">
                      <NativeSelectField
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        borderRadius="xl"
                        bg="gray.50"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      >
                        <option value="Student">🎓 Student</option>
                        <option value="Engineer">👷 Engineer</option>
                        <option value="Teacher">👨‍🏫 Teacher</option>
                        <option value="Unemployed">🔍 Unemployed</option>
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Field.Root>

                  {/* Phone Field */}
                  <Field.Root required invalid={!!errors.phone}>
                    <Field.Label fontSize="md" fontWeight="semibold" color="gray.700">
                      <HStack gap={2}>
                        <Text>📞</Text>
                        <Text>Phone Number</Text>
                      </HStack>
                    </Field.Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="📱 Enter phone number"
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      _focus={{ bg: "white", borderColor: "blue.400" }}
                      fontFamily="mono"
                    />
                    {errors.phone && <Field.ErrorText color="red.500">{errors.phone}</Field.ErrorText>}
                    <Field.HelperText fontSize="sm">
                      Example: +1234567890 or (123) 456-7890
                    </Field.HelperText>
                  </Field.Root>
                </VStack>

                {/* Preview Card */}
                {formData.name && (
                  <>
                    <Separator />
                    <Card.Root bg="blue.50" borderColor="blue.200" borderWidth={1}>
                      <Card.Body p={6}>
                        <VStack gap={4}>
                          <Text fontSize="lg" fontWeight="semibold" color="blue.700">
                            📋 Preview
                          </Text>
                          <HStack gap={6} w="100%" align="center">
                            <Box
                              w="50px"
                              h="50px"
                              borderRadius="full"
                              overflow="hidden"
                              bg="gray.100"
                            >
                              <Image
                                src={imagePreview || "/default-person.png"}
                                alt={formData.name}
                                w="100%"
                                h="100%"
                                objectFit="cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/default-person.png";
                                }}
                              />
                            </Box>
                            <VStack align="start" flex={1}>
                              <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                {formData.name || "Name"}
                              </Text>
                              <HStack gap={4} wrap="wrap">
                                <Badge colorPalette="blue" px={3} py={1}>
                                  {getGenderIcon(formData.gender)} {formData.gender}
                                </Badge>
                                <Badge colorPalette="green" px={3} py={1}>
                                  {getOccupationIcon(formData.occupation)} {formData.occupation}
                                </Badge>
                              </HStack>
                              {formData.phone && (
                                <Text fontSize="sm" color="gray.600" fontFamily="mono">
                                  📞 {formData.phone}
                                </Text>
                              )}
                            </VStack>
                          </HStack>
                        </VStack>
                      </Card.Body>
                    </Card.Root>
                  </>
                )}
              </VStack>
            </DialogBody>

            <DialogFooter p={8} pt={0}>
              <Flex w="100%" gap={4}>
                <Button 
                  variant="ghost" 
                  onClick={onClose} 
                  disabled={isSubmitting}
                  flex={1}
                  size="lg"
                  borderRadius="xl"
                >
                  ❌ Cancel
                </Button>
                <Button
                  type="submit"
                  colorPalette="blue"
                  loading={isSubmitting}
                  loadingText={user ? 'Updating...' : 'Creating...'}
                  flex={2}
                  size="lg"
                  borderRadius="xl"
                  fontWeight="bold"
                  shadow="lg"
                >
                  {user ? '✏️ Update User' : '👤 Create User'}
                </Button>
              </Flex>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default UserModal;