using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Xml;
using System.Xml.Linq;

namespace NodeToWayConverter
{
    /// <summary>
    /// Program to read an OpenStreetMap XML with nodes plus tags only and add a way for each node
    /// with a defined tag from the nodes.
    /// </summary>
    public class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length < 3)
            {
                Console.WriteLine($"Usage: {Process.GetCurrentProcess().MainModule.FileName} {Path.GetFileName(Assembly.GetEntryAssembly().Location)} <path to OSM file> <path to output directory> <tag to take over>");
                return;
            }

            var sourceFile = new FileInfo(args[0]);
            var outputDirectory = new DirectoryInfo(args[1]);

            if (!sourceFile.Exists)
            {
                Console.Error.WriteLine("Source file does not exist");
            }

            if (sourceFile.Directory.FullName.Equals(outputDirectory.FullName))
            {
                Console.Error.WriteLine("Source and output directory must not be the same");
                return;
            }

            if (!outputDirectory.Exists)
            {
                outputDirectory.Create();
            }

            ProcessFile(sourceFile, outputDirectory, args[2]);
        }

        /// <summary>
        /// Processes the <paramref name="sourceFile"/>. Generates an output file with the desired structure.
        /// </summary>
        /// <param name="sourceFile">The source file.</param>
        /// <param name="outputDirectory">The existing output directory.</param>
        /// <param name="tagKey">The key of the tag to use.</param>
        private static void ProcessFile(FileInfo sourceFile, DirectoryInfo outputDirectory, string tagKey)
        {
            var outputFile = new FileInfo(Path.Combine(outputDirectory.FullName, sourceFile.Name));

            using (var readStream = sourceFile.OpenRead())
            using (var writeStream = outputFile.Open(FileMode.Truncate))
            using (var xmlWriter = XmlWriter.Create(writeStream, new XmlWriterSettings { Indent = true }))
            {
                var sourceDocument = new XmlDocument();
                sourceDocument.Load(readStream);
                var osm = sourceDocument.DocumentElement;

                var targetRoot = new XElement("osm", new XAttribute("version", "0.6"));

                foreach (XmlNode node in osm.GetElementsByTagName("node"))
                {
                    var tagValue = node.SelectSingleNode($"tag[@k='{tagKey}']")?.Attributes.GetNamedItem("v")?.Value;
                    if (tagValue != null)
                    {
                        var nodeId = node.Attributes.GetNamedItem("id").Value;
                        var targetNode = new XElement("node",
                            new XAttribute("id", nodeId),
                            new XAttribute("lat", node.Attributes.GetNamedItem("lat").Value),
                            new XAttribute("lon", node.Attributes.GetNamedItem("lon").Value));
                        var targetWay = new XElement("way",
                            new XAttribute("id", Guid.NewGuid().ToString("N").GetHashCode()),
                            new XElement("nd",
                                new XAttribute("ref", nodeId)),
                            new XElement("tag",
                                new XAttribute("k", tagKey),
                                new XAttribute("v", tagValue)));
                        targetRoot.Add(targetNode);
                        targetRoot.Add(targetWay);
                    }
                }

                var targetDocument = new XDocument(targetRoot);
                targetDocument.WriteTo(xmlWriter);
            }
        }
    }
}
