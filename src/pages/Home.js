import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import Logo from '../components/Logo';
import LogoImage from '../assets/img/MARS.png';

const Home = () => {
    const [inputValue, setInputValue] = useState('');
    const [excelFile, setExcelFile] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        setSearchResults([]); // Réinitialiser les résultats de la recherche lorsqu'une nouvelle saisie est effectuée
    };

    const handleExcelChange = (e) => {
        const file = e.target.files[0];
        setExcelFile(file);
        setSearchResults([]); // Réinitialiser les résultats de la recherche lorsqu'un nouveau fichier Excel est sélectionné
    };

    const handleSearch = () => {
        if (!excelFile) {
            console.error('Veuillez sélectionner un fichier Excel avant de rechercher.');
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = function () {
            const arrayBuffer = this.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const targetValue = inputValue.trim(); // Ne pas convertir en minuscules
            const results = [];

            const range = XLSX.utils.decode_range(worksheet['!ref']);

            for (let row = range.s.r; row <= range.e.r; row++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: 5 }); // Colonne "JOURNAL" est la colonne 5

                const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : null;

                console.log('Row:', row);
                console.log('Cell Address:', cellAddress);
                console.log('Cell Value:', cellValue);

                if (typeof cellValue === 'string' && cellValue.trim() === targetValue) {
                    // Récupérer toutes les cellules de la ligne
                    const rowData = [];
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        const cellValue = worksheet[XLSX.utils.encode_cell({ r: row, c: col })]?.v;
                        rowData.push(cellValue);
                    }
                    results.push(rowData);
                }
            }

            console.log('Valeur recherchée:', targetValue);

            if (results.length === 0) {
                console.error(`La valeur '${targetValue}' n'a pas été trouvée dans la colonne "JOURNAL" du fichier Excel.`);
            }

            setSearchResults(results);
            console.log('Contenu du fichier Excel:', worksheet);
        };

        fileReader.readAsArrayBuffer(excelFile);
    };



    const handleExcelDownload = () => {
        if (searchResults.length === 0) {
            console.error('Veuillez d\'abord effectuer une recherche avant de télécharger le PDF.');
            return;
        }

        // Logique pour créer et télécharger le fichier PDF
        const pdf = new jsPDF();

        // Ajouter le logo et le nom de l'entreprise en haut de la page
        pdf.addImage(LogoImage, 'JPEG', 10, 10, 40, 40);
        pdf.setFontSize(8);
        pdf.text('Direction de l’Exploitation au Port de Safi\n8, Front de Mer Safi - Maroc\nB.P n° 8 Safi - Maroc\nTél. : 05 24 46 22 56 / 05 24 46 23 90\nFax : 05 24 46 48 28\nE-mail : Safi@marsamaroc.co.ma', 130, 23);

        // Ajouter une séparation
        pdf.line(10, 60, 200, 60);

        // Ajuster la taille de la police et la hauteur de la ligne pour les résultats
        pdf.setFontSize(5.9);
        const lineHeight = 10;

        // Ajouter les résultats de la recherche dans le PDF
        searchResults.forEach((row, rowIndex) => {
            const rowData = row
                .filter(cell => cell && cell !== undefined && cell !== null)
                .map(cell => cell.toString());

            if (rowData.length > 0) {
                const textContent = rowData.join(' ');
                const yPos = 70 + rowIndex * lineHeight;

                // Diviser le texte en fonction de la largeur de la page
                const textLines = pdf.splitTextToSize(textContent, 190);

                // Ajouter chaque ligne de texte
                textLines.forEach((line, lineIndex) => {
                    pdf.text(line, 10, yPos + lineIndex * lineHeight);
                });

                pdf.text(" ", 10, yPos + textLines.length * lineHeight); // Ajouter un espace pour séparer les lignes
            }
        });

        // Obtenir la date et l'heure actuelles
        const currentDate = new Date();
        const formattedDateTime = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

        // Ajouter une deuxième partie de texte à la fin de la page et centrée avec la date et l'heure
        const secondPartText = ` - Marsa Maroc - ${formattedDateTime}`;
        const textWidth = pdf.getStringUnitWidth(secondPartText) * pdf.internal.getFontSize();
        const centerX = (pdf.internal.pageSize.width - textWidth) / 1.5;

        pdf.setFontSize(8); // Changer la taille de la police si nécessaire
        pdf.text(secondPartText, centerX, pdf.internal.pageSize.height - 10);



        // Télécharger le fichier PDF
        pdf.save('output.pdf');
    };










    return (
        <div className="container">
            <Logo /><br />
            <label>
                <h3>                Sélectionner un fichier Excel </h3><br />
                <input type="file" accept=".xlsx, .xls" onChange={handleExcelChange} />
            </label><br /><br /><br />
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Entrez la valeur de recherche ici..."
            /><br /><br />
            <button onClick={handleSearch}>Rechercher</button><br /><br />
            {/* Afficher le résultat de la recherche */}
            {searchResults.length > 0 && (
                <div>
                    Résultats de la recherche :
                    <pre>{JSON.stringify(searchResults, null, 2)}</pre>
                </div>
            )}
            <br /><br />
            <button className='AA' onClick={handleExcelDownload}>Télécharger PDF</button>
        </div>
    );
};

export default Home;
