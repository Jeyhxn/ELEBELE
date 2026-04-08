using SocialMediaForGamersApp.Utilities.Enums;

namespace SocialMediaForGamersApp.Utilities.Extensions
{
    public static class FileValidator
    {
        public static bool ValidateType(this IFormFile file, string type)
        {
            return file.ContentType.Contains(type);
        }

        public static bool ValidateSize(this IFormFile file, FileSize fileSize, long size)
        {
            long maxBytes = fileSize switch
            {
                FileSize.KB => size * 1024,
                FileSize.MB => size * 1024 * 1024,
                FileSize.GB => size * 1024 * 1024 * 1024,
                _ => 0
            };

            return file.Length <= maxBytes;
        }

        public static async Task<string> CreateFileAsync(this IFormFile file, params string[] roots)
        {
            string filename = string.Concat(Guid.NewGuid().ToString(), file.FileName);

            string path = string.Empty;
            for (int i = 0; i < roots.Length; i++)
            {
                path = Path.Combine(path, roots[i]);
            }

            path = Path.Combine(path, filename);

            using (FileStream filestream = new(path, FileMode.Create))
            {
                await file.CopyToAsync(filestream);
            }

            return filename;
        }

        public static void DeleteFile(this string filename, params string[] roots)
        {
            string path = string.Empty;
            for (int i = 0; i < roots.Length; i++)
            {
                path = Path.Combine(path, roots[i]);
            }

            path = Path.Combine(path, filename);

            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }
    }
}
