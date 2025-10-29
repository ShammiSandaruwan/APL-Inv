// src/components/ImageUpload.tsx
import {
  Button,
  FileButton,
  Grid,
  Group,
  Image,
  Loader,
  Paper,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconTrash, IconUpload } from '@tabler/icons-react';
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { showErrorToast, showSuccessToast } from '../utils/toast';

interface ImageUploadProps {
  onPhotoChange: (urls: string[]) => void;
  initialUrls?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onPhotoChange,
  initialUrls = [],
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>(initialUrls);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (files: File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}_${file.name}`;
      try {
        const { data, error } = await supabase.storage
          .from('item-photos')
          .upload(fileName, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from('item-photos').getPublicUrl(data.path);
        if (publicUrl) {
          uploadedUrls.push(publicUrl);
        }
      } catch (error: any) {
        showErrorToast(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    const newUrls = [...imageUrls, ...uploadedUrls];
    setImageUrls(newUrls);
    onPhotoChange(newUrls);
    setIsUploading(false);
    if (uploadedUrls.length > 0) {
      showSuccessToast('Images uploaded successfully!');
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const newUrls = imageUrls.filter((url) => url !== urlToRemove);
    setImageUrls(newUrls);
    onPhotoChange(newUrls);
  };

  return (
    <div>
      <Text size="sm" fw={500}>
        Photos
      </Text>
      <Paper withBorder p="md" radius="md" mt="xs">
        <Group>
          <FileButton onChange={handleFileChange} accept="image/*" multiple>
            {(props) => (
              <Button {...props} leftSection={<IconUpload size={16} />}>
                Upload images
              </Button>
            )}
          </FileButton>
          {isUploading && <Loader size="sm" />}
        </Group>

        <Grid mt="md">
          {imageUrls.map((url) => (
            <Grid.Col span={4} key={url}>
              <Paper withBorder radius="md" style={{ position: 'relative' }}>
                <Image src={url} height={100} alt="Uploaded" />
                <ThemeIcon
                  color="red"
                  variant="filled"
                  onClick={() => handleRemoveImage(url)}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    cursor: 'pointer',
                  }}
                  size="sm"
                >
                  <IconTrash size={12} />
                </ThemeIcon>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

export default ImageUpload;
