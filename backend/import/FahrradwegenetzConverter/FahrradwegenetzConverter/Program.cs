using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace FahrradwegenetzConverter
{
    /// <summary>
    /// Program to read the "Fahrradwegenetz" OpenStreetMap XML, remove all unneeded
    /// tags and add tags based on category of the bike track, derived from filename.
    /// </summary>
    public class Program
    {
        private const string FileNameSuffix = "_LL_WGS84";
        private const string FileNameExtension = ".osm";
        private const string TagKey = "biketracktype";

        private static readonly Regex TagReplacementRegex = new Regex(@"(\s*<tag.* />\s*)+");

        public static void Main(string[] args)
        {
            if (args.Length < 2)
            {
                Console.WriteLine($"Usage: {Process.GetCurrentProcess().MainModule.FileName} {Path.GetFileName(Assembly.GetEntryAssembly().Location)} <path to directory with {FileNameSuffix}{FileNameExtension} files> <path to output directory>");
                return;
            }

            var sourceDirectory = new DirectoryInfo(args[0]);
            var outputDirectory = new DirectoryInfo(args[1]);

            if (sourceDirectory.FullName.Equals(outputDirectory.FullName))
            {
                Console.Error.WriteLine("Source and output directory must not be the same");
                return;
            }

            if (!outputDirectory.Exists)
            {
                outputDirectory.Create();
            }

            foreach (var sourceFile in sourceDirectory.GetFiles($"*{FileNameSuffix}{FileNameExtension}"))
            {
                ProcessFile(sourceFile, outputDirectory);
            }
        }

        /// <summary>
        /// Processes the <paramref name="sourceFile"/>. Generates an output file name and a tag value
        /// from the input file name. Reads the input content and replaces the existing tags with a
        /// new tag with key <see cref="TagKey"/>.
        /// </summary>
        /// <param name="sourceFile">The source file.</param>
        /// <param name="outputDirectory">The existing output directory.</param>
        /// <remarks>
        /// Done via Regex, since the input files always contain the same pattern, which makes an XML reader
        /// and writer being too much overhead.
        /// </remarks>
        private static void ProcessFile(FileInfo sourceFile, DirectoryInfo outputDirectory)
        {
            var tagValue = sourceFile.Name.Replace(FileNameSuffix + FileNameExtension, string.Empty);
            var outputFile = new FileInfo(Path.Combine(outputDirectory.FullName, tagValue + FileNameExtension));

            using (var readStream = sourceFile.OpenRead())
            using (var streamReader = new StreamReader(readStream))
            using (var writeStream = outputFile.OpenWrite())
            using (var streamWriter = new StreamWriter(writeStream))
            {
                var fileContent = streamReader.ReadToEnd();

                var tagXml = new XElement("tag", new XAttribute("k", TagKey), new XAttribute("v", tagValue));
                var outputContent = TagReplacementRegex.Replace(fileContent, $"\n{tagXml.ToString(SaveOptions.DisableFormatting)}\n");

                streamWriter.Write(outputContent);
            }
        }
    }
}
